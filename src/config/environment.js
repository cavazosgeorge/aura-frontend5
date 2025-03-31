const getBackendUrl = () => {
  const env = import.meta.env.VITE_APP_ENV || 'local'
  console.log('Current VITE_APP_ENV:', env);  
  let url;
  switch (env) {
    case 'production':
      url = 'http://146.240.94.12:3001';
      break;
    case 'development':
      url = 'http://146.240.94.12:3002'; 
      break;
    default:
      // For local development, use the VM IP address for authentication service
      url = 'http://146.240.94.12:3002';
  }
  console.log(`Current environment: ${env}, Using backend URL: ${url}`);
  return url;
};

export const config = {
  backendUrl: getBackendUrl()
};