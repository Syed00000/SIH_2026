export const validateLoginForm = (email, password) => {
  const errors = { email: '', password: '' };
  const trimmedEmail = (email || '').trim();

  if (!trimmedEmail) {
    errors.email = 'Please enter your email, username, or mobile number.';
  }

  if (!password) {
    errors.password = 'Please enter your password.'; // NOSONAR - form validation error message, not a hardcoded secret
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.'; // NOSONAR
  }

  return {
    isValid: !errors.email && !errors.password,
    errors
  };
};

export const navigateByRole = (loggedUser, onNavigate) => {
  const userRole = (loggedUser?.role || '').toUpperCase();

  const goTo = (dest, params) => {
    if (onNavigate) {
      onNavigate(dest, params);
    } else {
      const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
      window.location.href = `${dest}${qs}`;
    }
  };

  if (userRole === 'DEPARTMENT' || loggedUser?.deptId) {
    const targetId = loggedUser.deptId || loggedUser.id;
    return goTo('/department', { deptId: targetId });
  }
  if (userRole === 'WARD' || loggedUser?.wardId) {
    const targetId = loggedUser.wardId || loggedUser.id;
    return goTo('/ward', { wardId: targetId });
  }
  if (userRole === 'BLOCK' || loggedUser?.blockId) {
    const targetId = loggedUser.blockId || loggedUser.id;
    return goTo('/block', { blockId: targetId });
  }
  if (userRole === 'TECHNICIAN' || loggedUser?.technicianId || userRole.includes('TECH')) {
    const targetId = loggedUser.technicianId || loggedUser.id || '';
    return goTo('/technician', { techId: targetId });
  }
  if (userRole === 'BUDGET_OFFICER' || userRole.includes('BUDGET')) {
    return goTo('/budget-officer');
  }
  if (userRole === 'FACULTY' || userRole.includes('FACULTY')) {
    return goTo('/faculty');
  }
  if (userRole === 'UNIVERSITY' || userRole === 'HEI') {
    return goTo('/university');
  }
  if (userRole === 'NODAL' || userRole.includes('NODAL')) {
    return goTo('/nodal');
  }
  if (userRole === 'INDUSTRY') {
    return goTo('/industry-portal');
  }
  if (userRole === 'CITIZEN' || userRole === 'USER') {
    return goTo('/citizen');
  }
  if (userRole === 'GOVERNMENT' || userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
    return goTo('/government');
  }

  return goTo('/dashboard');
};

export const parseLoginError = (error) => {
  const status = error?.response?.status || error?.status;
  const errData = error?.response?.data?.error || error?.response?.data || {};
  const rawMsg = (errData?.message || error?.message || '').toString();

  if (
    rawMsg === 'USER_NOT_FOUND' ||
    rawMsg.toLowerCase().includes('user not found') ||
    rawMsg.toLowerCase().includes('not exist') ||
    rawMsg === 'INVALID_CREDENTIALS' ||
    rawMsg.toLowerCase().includes('credential') ||
    rawMsg.toLowerCase().includes('password mismatch') ||
    status === 401
  ) {
    return { message: 'Invalid email or password. Please verify your credentials or create a new account.' };
  }
  if (rawMsg === 'EMAIL_NOT_VERIFIED' || rawMsg.toLowerCase().includes('verify')) {
    return {
      message: 'Your email address is not verified yet. Redirecting to email verification...',
      isUnverified: true
    };
  }
  if (rawMsg === 'ACCOUNT_SUSPENDED' || rawMsg === 'ACCOUNT_BLOCKED') {
    return { message: 'This account is suspended or blocked. Please contact the administrator.' };
  }
  if (rawMsg === 'ACCOUNT_NOT_ACTIVE') {
    return { message: 'This account is inactive. Please contact support.' };
  }
  if (status === 429 || rawMsg.includes('RATE_LIMIT')) {
    return { message: 'Too many failed attempts. Please wait a minute before retrying.' };
  }
  if (
    error.name === 'TypeError' ||
    rawMsg.toLowerCase().includes('failed to fetch') ||
    rawMsg.toLowerCase().includes('network') ||
    error?.code === 'ERR_NETWORK' ||
    rawMsg.includes('ERR_CONNECTION_REFUSED')
  ) {
    return { message: 'Unable to connect to backend server. Please make sure the server is active on port 3000.' };
  }
  return { message: rawMsg || 'Login failed. Please check your credentials and try again.' };
};
