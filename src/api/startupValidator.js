import { validateFirebaseAccess } from './firebaseValidator';

/**
 * Run Firebase database validation on startup
 * This will help diagnose if there are any issues with user creation and nested collections
 */
export const runStartupValidation = async () => {
  console.log('Running startup validation for Firebase...');
  
  try {
    // Wait a bit to ensure Firebase is initialized
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Run validation
    const result = await validateFirebaseAccess();
    
    console.log('Startup validation complete:', result);
    return result;
  } catch (error) {
    console.error('Startup validation failed:', error);
    return {
      success: false,
      error: error.message,
      phase: 'startup'
    };
  }
};

// Export a function to manually trigger validation
export const testDatabaseAccess = validateFirebaseAccess;
