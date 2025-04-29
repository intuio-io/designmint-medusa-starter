interface TokenCache {
    token: string;
    expiresAt: number;
  }
  
  let tokenCache: TokenCache | null = null;
  
  export async function getAdminToken(): Promise<string> {
    // Check if we have a cached token that's still valid
    // Adding 5 minute buffer before expiry
    const BUFFER_TIME = 5 * 60 * 1000; 
    
    if (tokenCache && tokenCache.expiresAt > Date.now() + BUFFER_TIME) {
      return tokenCache.token;
    }
  
    // If no valid cached token, get a new one
    const authResponse = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/auth/user/emailpass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'veleston@intuio.io',
        password: 'supersecret',
      }),
    });
  
    if (!authResponse.ok) {
      throw new Error('Authentication failed');
    }
  
    
    const { token } = await authResponse.json();
    
    // Cache the new token
    // Setting expiry to 24 hours from now (you can adjust this based on your token expiry)
    tokenCache = {
      token: token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };
  
    return token;
  }
  
  // Utility to validate token without making an API call
  export function isTokenValid(): boolean {
    const BUFFER_TIME = 5 * 60 * 1000; // 5 minute buffer
    return !!(tokenCache && tokenCache.expiresAt > Date.now() + BUFFER_TIME);
  }
  
  // Utility to clear token if needed
  export function clearToken(): void {
    tokenCache = null;
  }
  
  // Example of how to handle token errors
  export async function makeAuthenticatedRequest(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    try {
      const token = await getAdminToken();
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'x-publishable-api-key': 'pk_4849f2d741d03b7a93feed52973f2d2c49a84a44208e2bea39aaca571d8e4d46'
        },
      });
  
      if (response.status === 401) {
        // Token might be invalid, clear it and retry once
        clearToken();
        const newToken = await getAdminToken();
        
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
          },
        });
      }
  
      return response;
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  }



