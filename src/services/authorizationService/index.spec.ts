import { AuthorizationService } from '.';
import { api } from '@/lib';

// Mock da API
jest.mock('@/lib', () => ({
  api: {
    post: jest.fn()
  }
}));

// Não podemos mockar next-runtime-env diretamente, então vamos testar apenas a lógica
// que não depende dessa biblioteca

describe('AuthorizationService', () => {
  it('should return the access token when the request is successful', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        access_token: 'valid-token',
        token_type: 'bearer',
        expires_in: 3600
      }
    };
    
    (api.post as jest.Mock).mockResolvedValue(mockResponse);
    
    // Act
    const result = await AuthorizationService();
    
    // Assert
    expect(api.post).toHaveBeenCalled();
    expect(result).toEqual({
      access_token: 'valid-token',
      token_type: 'bearer',
      expires_in: 3600
    });
  });
  
  it('should return an empty token when the response status is not 200', async () => {
    // Arrange
    const mockResponse = {
      status: 401,
      data: {
        error: 'unauthorized'
      }
    };
    
    (api.post as jest.Mock).mockResolvedValue(mockResponse);
    
    // Act
    const result = await AuthorizationService();
    
    // Assert
    expect(result).toEqual({ access_token: '' });
  });
  
  it('should return an empty token when the response does not contain an access token', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {
        // Sem access_token
        token_type: 'bearer',
        expires_in: 3600
      }
    };
    
    (api.post as jest.Mock).mockResolvedValue(mockResponse);
    
    // Act
    const result = await AuthorizationService();
    
    // Assert
    expect(result).toEqual({ access_token: '' });
  });
  
  it('should handle request errors', async () => {
    // Arrange
    const mockError = new Error('Network error');
    (api.post as jest.Mock).mockRejectedValue(mockError);
    
    // Act & Assert
    try {
      await AuthorizationService();
      // If we reach here, the test should fail
      expect('This should not be reached').toBe('The service should throw an error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('Network error');
    }
  });

  it('should handle unexpected response formats', async () => {
    // Arrange
    const mockResponse = {
      status: 200,
      data: {} // Empty object without expected properties
    };
    
    (api.post as jest.Mock).mockResolvedValue(mockResponse);
    
    // Act
    const result = await AuthorizationService();
    
    // Assert
    expect(result).toEqual({ access_token: '' });
  });
});
