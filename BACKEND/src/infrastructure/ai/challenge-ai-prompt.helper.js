/**
 * Helper to build LLM prompts and deterministic fallback for challenge intelligence
 */

export function buildIntelligencePrompts({ challenge, departments, universities, similarMatches }) {
  const deptsList = departments.map((d) => `${d.name} (${d.category || 'Line Dept'}, Code: ${d.code || 'JH-DEPT'})`).join(', ');
  const heisList = universities.map((u) => `${u.name} (${u.district || 'JH'}, ${u.code || 'JH-HEI'})`).join(', ');

  const systemPrompt = `You are JoharSetu AI, the official state civic triage & jurisdiction routing engine for Government of Jharkhand.
Follow these strict administrative and jurisdictional rules:
1. JURISDICTION & SCOPE CLASSIFICATION:
   - Routine, localized, neighborhood grievances (e.g. broken tap, leaking pipeline in a lane, pothole, street light outage, ward garbage, local power fluctuation) MUST have "problemScope.level" = "WARD" (or "BLOCK" if no ward) and "problemScope.isMacroChallenge" = false.
   - ONLY catastrophic, widespread, systemic crises (e.g. major dam overflow, city-wide flood, industrial chemical disaster, state grid blackout, epidemic) should have "problemScope.level" = "STATE" and "problemScope.isMacroChallenge" = true.
2. LINE DEPARTMENT / WARD ROUTING:
   - For WARD or BLOCK issues: DO NOT recommend State Ministry (JH-STATE). You MUST recommend the local "Ward Commissioner" or "Block / Tehsil Office" to dispatch field technicians.
   - For STATE macro crises: Recommend the designated State Ministry.
3. ACADEMIC R&D & UNIVERSITY MATCHING:
   - For WARD / BLOCK routine maintenance: University academic prototyping is NOT required. Set "recommendedHEI.isAcademicRequired" = false, "recommendedHEI.name" = "Not Applicable (Routine Ward Maintenance)", "recommendedHEI.confidence" = 0, and reasoning explaining that university labs are reserved for macro engineering innovations.
   - For STATE macro crises: Set "recommendedHEI.isAcademicRequired" = true and match a relevant university research lab.

Respond ONLY with valid JSON. No explanations, no markdown fences.`;

  const userPrompt = `Issue: "${challenge.title} - ${challenge.description}"
Location: District: ${challenge.location?.district || challenge.district || 'Jharkhand'}, Block: ${challenge.location?.block || 'N/A'}, Ward: ${challenge.location?.panchayatOrWard || 'N/A'}
Priority: ${challenge.priority || 'Medium'}
Available Entities: [${deptsList}]
HEIs: [${heisList}]
Similar Registered Issues: ${similarMatches.map((m) => `${m.challengeId}: ${m.title}`).join('; ') || 'None'}

Return JSON:
{
  "classifiedDomain": "Water Resources" | "Energy" | "Urban Development" | "Environment" | "Agriculture" | "Education" | "Healthcare" | "Other",
  "problemScope": {
    "level": "WARD" | "BLOCK" | "STATE",
    "tierLabel": "<e.g. Local Ward Grievance (Ward 64) or Macro State Innovation Challenge>",
    "isMacroChallenge": false,
    "scopeReason": "<explanation of why ward vs state>"
  },
  "recommendedDepartment": {
    "name": "<exact name from departments list>",
    "code": "<code from list>",
    "category": "Ward Commissioner" | "Block / Tehsil Office" | "District Department" | "State Ministry",
    "confidence": 95,
    "reasoning": "<statutory rationale for this administrative tier>"
  },
  "recommendedHEI": {
    "isAcademicRequired": false,
    "name": "<exact name or Not Applicable (Routine Ward Maintenance)>",
    "code": "<code or ROUTINE-MAINTENANCE>",
    "confidence": 0,
    "reasoning": "<short reasoning>"
  },
  "recommendedIndustry": {
    "name": "<industry sector>",
    "reasoning": "<short potential>"
  },
  "priorityAssessment": {
    "priority": "Low" | "Medium" | "High" | "Critical",
    "severityScore": 75,
    "affectedEstimate": "500 - 2,000 residents",
    "urgencyReason": "<short rationale>"
  },
  "solutionStatus": {
    "hasPrecedent": false,
    "precedentSummary": "<precedent note>",
    "recommendedAction": "<action SOP>"
  },
  "summary": "<1-line summary>"
}`;

  return { systemPrompt, userPrompt };
}

export function buildDeterministicFallback({ challenge, departments, universities, topMatch }) {
  const text = `${challenge.title} ${challenge.description}`.toLowerCase();
  const district = (challenge.location?.district || challenge.district || '').toLowerCase();
  const wardNo = challenge.location?.panchayatOrWard || '';

  // Detect domain with comprehensive Hindi/Hinglish and English civic vocabulary
  const isWater = /water|drain|sewer|pipe|paani|pani|nalka|submersible|leakage|flood|badh|naali|jal|waterlogging|tap|tanker/i.test(text);
  const isEnergy = /electric|light|power|wire|transformer|pole|bijli|line|andhera|current|voltage|bulb/i.test(text);
  const isRoad = /road|pothole|gaddha|sadak|bridge|pul|traffic|street|highway/i.test(text);
  const isSanitation = /garbage|kachra|dustbin|safai|clean|smell|badbu|waste/i.test(text);
  const isHealth = /hospital|dawa|doctor|health|swasthya|dengue|malaria|clinic/i.test(text);

  let classifiedDomain = 'Urban Development';
  if (isWater) classifiedDomain = 'Water Resources';
  else if (isEnergy) classifiedDomain = 'Energy';
  else if (isRoad) classifiedDomain = 'Road Construction';
  else if (isSanitation) classifiedDomain = 'Urban Development';
  else if (isHealth) classifiedDomain = 'Healthcare';
  else if (challenge.domain) classifiedDomain = challenge.domain;

  // Determine Problem Scope: Only genuine systemic catastrophes/disasters count as Macro State challenges.
  // Standard ward water shortages, broken taps, or streetlight outages are strictly Local Ward Maintenance.
  const isMacro = /flood|badh|dam\b|river overflow|disaster|epidemic|outbreak|grid failure|massive|industrial pollution|chemical toxic|arsenic|structural failure|bridge collapse|statewide|citywide/i.test(text);

  const problemScope = {
    level: isMacro ? 'STATE' : wardNo ? 'WARD' : 'BLOCK',
    tierLabel: isMacro
      ? 'Macro State Innovation Challenge'
      : wardNo
      ? `Local Ward Grievance (Ward ${wardNo})`
      : 'Local Block Grievance',
    isMacroChallenge: isMacro,
    scopeReason: isMacro
      ? 'Large-scale systemic challenge with district or state-wide impact requiring institutional engineering design, state line ministry mobilization, and university research.'
      : `Localized neighborhood maintenance problem in Ward ${wardNo || 'local area'}, ${challenge.district || 'Jharkhand'}. Suitable for direct ward field technician resolution, not state ministry or university R&D.`
  };

  // Match Department according to administrative scope
  let matchedDept = null;

  if (!isMacro) {
    // Local issue: ALWAYS route to Ward Commissioner or Block Office, NEVER to State Ministry (JH-STATE)
    if (isEnergy) {
      matchedDept = departments.find((d) => (d.category === 'Block / Tehsil Office' || d.category === 'Ward Commissioner') && /electric|energy|power|bijli/i.test(d.name))
        || departments.find((d) => d.category === 'Block / Tehsil Office')
        || departments.find((d) => d.category === 'Ward Commissioner');
    } else {
      // For water, drainage, sanitation, roads: prioritize Ward Commissioner
      matchedDept = departments.find((d) => d.category === 'Ward Commissioner')
        || departments.find((d) => d.code?.startsWith('WARD'))
        || departments.find((d) => d.category === 'Block / Tehsil Office');
    }

    if (!matchedDept) {
      matchedDept = {
        name: wardNo ? `Ward Commissioner (Ward ${wardNo})` : 'Local Ward Commissioner',
        code: `WARD-${wardNo || '64'}`,
        category: 'Ward Commissioner'
      };
    } else {
      // Enhance display name with specific ward number if present
      if (wardNo && matchedDept.category === 'Ward Commissioner' && !matchedDept.name.includes(wardNo)) {
        matchedDept = {
          ...matchedDept,
          name: `Ward Commissioner (Ward ${wardNo})`
        };
      }
    }
  } else {
    // Macro systemic challenge: Route to State Ministry or District Department
    matchedDept = departments.find((d) => {
      const dName = (d.name || '').toLowerCase();
      if (isWater && (dName.includes('water') || dName.includes('jal') || dName.includes('sanitation'))) return true;
      if (isEnergy && (dName.includes('electric') || dName.includes('power') || dName.includes('energy') || dName.includes('bijli'))) return true;
      if (isRoad && (dName.includes('road') || dName.includes('pwd') || dName.includes('construction'))) return true;
      return false;
    }) || departments.find((d) => d.category === 'State Ministry') || departments[0] || { name: 'State Ministry Department', code: 'JH-STATE', category: 'State Ministry' };
  }

  // Match HEI: Academic R&D is strictly disabled for routine ward maintenance
  let matchedUni = universities.find((u) => {
    const uName = (u.name || '').toLowerCase();
    const uDist = (u.district || '').toLowerCase();
    return uDist.includes(district) || uName.includes(district);
  }) || universities[0] || { name: 'Birla Institute of Technology, Mesra', code: 'BIT-MESRA-JH' };

  const isCritical = /danger|hazard|burst|accident|current|shock|fatal|khatra/i.test(text);
  const isHigh = /flood|blocked|overflow|outage|dark|andhera|emergency|urgent/i.test(text);

  const deptReasoning = !isMacro
    ? `Local grassroots civic issue affecting Ward ${wardNo || 'locality'}. Assigned to ${matchedDept.name} (${matchedDept.category || 'Ward Level'}) for prompt on-ground technician inspection and repair, keeping state ministry administrative overhead minimal.`
    : isWater
    ? `Designated statutory authority under Government of Jharkhand for macro water infrastructure, flood control, and state drinking water security in ${challenge.district || 'Jharkhand state'}.`
    : isEnergy
    ? `Exclusive statutory distribution licensee for electricity supply, grid maintenance, and high-voltage transmission in ${challenge.district || 'Jharkhand state'} under JSERC regulations.`
    : `Statutory jurisdictional authority for ${classifiedDomain} in ${challenge.district || 'Jharkhand state'}.`;

  const heiReasoning = isMacro
    ? `Equipped with dedicated engineering research laboratories, IoT sensors, and prototyping facilities for rapid TRL solution deployment.`
    : `Routine field maintenance problem. Academic university prototyping or state research grant is not required for this local ward issue.`;

  return {
    classifiedDomain,
    problemScope,
    recommendedDepartment: {
      name: matchedDept.name,
      code: matchedDept.code || 'JH-DEPT',
      category: matchedDept.category || (isMacro ? 'State Ministry' : 'Ward Commissioner'),
      confidence: isWater || isEnergy || isRoad ? 94 : 88,
      reasoning: deptReasoning
    },
    recommendedHEI: {
      isAcademicRequired: isMacro,
      name: isMacro ? matchedUni.name : 'Not Applicable (Routine Ward Maintenance)',
      code: isMacro ? (matchedUni.code || 'JH-HEI') : 'ROUTINE-MAINTENANCE',
      confidence: isMacro ? 85 : 0,
      reasoning: heiReasoning
    },
    recommendedIndustry: {
      name: isEnergy ? 'Power Infrastructure & Smart Grid Technology' : isWater ? 'Hydrological Engineering & Water Treatment' : 'Civil Engineering & Smart City Infrastructure',
      reasoning: 'Eligible for CSR technology assistance and pilot implementation.'
    },
    priorityAssessment: {
      priority: isCritical ? 'Critical' : isHigh ? 'High' : 'Medium',
      severityScore: isCritical ? 92 : isHigh ? 78 : 58,
      affectedEstimate: isCritical ? '2,500 - 10,000 residents' : isHigh ? '1,000 - 3,000 residents' : '500 - 1,500 residents',
      urgencyReason: isCritical ? 'Immediate public safety risk reported on the ground.' : isHigh ? 'Significant civic disruption affecting daily community activities.' : 'Standard municipal remediation schedule applicable.'
    },
    solutionStatus: {
      hasPrecedent: Boolean(topMatch && topMatch.similarityScore >= 0.85),
      precedentSummary: topMatch
        ? `Similar civic issue (${topMatch.challengeId}) registered in ${topMatch.district || 'Jharkhand'}.`
        : 'Novel problem statement recorded in the district registry without prior duplicate resolution.',
      recommendedAction: `Dispatch ${matchedDept.category || 'Ward'} field crew from ${matchedDept.name}.`
    },
    summary: `${challenge.title}: ${classifiedDomain} (${problemScope.tierLabel}) in ${challenge.district || 'Jharkhand'}.`,
    keywords: [classifiedDomain, problemScope.tierLabel, challenge.district || 'Jharkhand'].filter(Boolean)
  };
}
