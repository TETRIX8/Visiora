// Simple script to verify service account key
import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';
import chalk from 'chalk';

// Path to service account file
const serviceAccountPath = resolve(process.cwd(), 'service-account-key.json');

console.log(chalk.cyan('\n--- Checking Service Account Key ---'));
console.log(`Looking for file at: ${chalk.yellow(serviceAccountPath)}`);

// Check if file exists
if (existsSync(serviceAccountPath)) {
  console.log(chalk.green('✓ SUCCESS: Service account key found!'));
  
  try {
    // Try to read it as JSON to ensure it's valid
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    
    // Verify required fields
    const requiredFields = ['project_id', 'private_key', 'client_email'];
    const missingFields = requiredFields.filter(field => !serviceAccount[field]);
    
    if (missingFields.length > 0) {
      console.error(chalk.red(`❌ ERROR: Service account key is missing required fields: ${missingFields.join(', ')}`));
      process.exit(1);
    }
    
    console.log(chalk.green('✓ Service account key is valid JSON.'));
    console.log(`${chalk.blue('Project ID:')} ${chalk.yellow(serviceAccount.project_id)}`);
    console.log(`${chalk.blue('Client Email:')} ${chalk.yellow(serviceAccount.client_email)}`);
    console.log(chalk.green('✓ Your service account key is ready for use.'));
  } catch (error) {
    console.error(chalk.red(`❌ ERROR: Service account key exists but is not valid JSON: ${error.message}`));
    process.exit(1);
  }
} else {
  console.error(chalk.red('❌ ERROR: Service account key file not found!'));
  console.log(chalk.yellow('\nPlease make sure you have downloaded the service account key from Firebase console'));
  console.log(chalk.yellow('and saved it as "service-account-key.json" in your project root directory.'));
  console.log(`Path checked: ${chalk.dim(serviceAccountPath)}`);
  process.exit(1);
}
