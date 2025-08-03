// Tests for hash functions to verify determinism

/**
 * This is a copy of the hash function from imageService.js
 */
const generateHashId = (input, length = 20, includeTimestamp = false) => {
  let hash = 0;
  if (input.length === 0) return hash.toString(36);
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  let hashStr = Math.abs(hash).toString(36);
  
  if (includeTimestamp) {
    hashStr += Date.now().toString(36);
  }
  
  while (hashStr.length < length) {
    hashStr += Math.abs(hash).toString(36);
  }
  
  return hashStr.slice(0, length);
};

/**
 * Generate a container ID (deterministic for same user and date)
 */
const generateContainerId = (uid) => {
  const today = new Date().toISOString().split('T')[0];
  return generateHashId(`${uid}-container-${today}`, 16, false);
};

// Tests
function testHash() {
  console.log("TESTING HASH FUNCTIONS");
  console.log("======================");
  
  // Test basic determinism (same input should produce same output)
  const input1 = "hello";
  const hash1a = generateHashId(input1, 10, false);
  const hash1b = generateHashId(input1, 10, false);
  
  console.log(`Test 1: Basic determinism`);
  console.log(`Input: "${input1}"`);
  console.log(`Hash 1: ${hash1a}`);
  console.log(`Hash 2: ${hash1b}`);
  console.log(`Same hash? ${hash1a === hash1b ? "✓ YES" : "✗ NO"}`);
  console.log();
  
  // Test with timestamps (should be different)
  const input2 = "world";
  const hash2a = generateHashId(input2, 10, true);
  
  // Wait 10ms to ensure timestamp changes
  setTimeout(() => {
    const hash2b = generateHashId(input2, 10, true);
    
    console.log(`Test 2: With timestamps`);
    console.log(`Input: "${input2}"`);
    console.log(`Hash 1: ${hash2a}`);
    console.log(`Hash 2: ${hash2b}`);
    console.log(`Different hash? ${hash2a !== hash2b ? "✓ YES" : "✗ NO"}`);
    console.log();
    
    // Test container ID for same user on same day (should be same)
    const uid = "user123";
    const containerId1 = generateContainerId(uid);
    const containerId2 = generateContainerId(uid);
    
    console.log(`Test 3: Container ID on same day`);
    console.log(`User: ${uid}`);
    console.log(`Container ID 1: ${containerId1}`);
    console.log(`Container ID 2: ${containerId2}`);
    console.log(`Same container ID? ${containerId1 === containerId2 ? "✓ YES" : "✗ NO"}`);
    console.log();
    
    // Test container ID for different users on same day (should be different)
    const uid2 = "user456";
    const containerId3 = generateContainerId(uid2);
    
    console.log(`Test 4: Container ID for different users`);
    console.log(`User 1: ${uid}`);
    console.log(`User 2: ${uid2}`);
    console.log(`Container ID 1: ${containerId1}`);
    console.log(`Container ID 2: ${containerId3}`);
    console.log(`Different container ID? ${containerId1 !== containerId3 ? "✓ YES" : "✗ NO"}`);
    console.log();
    
    // Test image ID generation (should include some deterministic part and some unique part)
    const prompt = "Beautiful mountain";
    const imageId1 = generateHashId(`${uid}-${containerId1}-${prompt}-0`, 16, false) + Date.now().toString(36).slice(0, 4);
    
    setTimeout(() => {
      const imageId2 = generateHashId(`${uid}-${containerId1}-${prompt}-0`, 16, false) + Date.now().toString(36).slice(0, 4);
      
      console.log(`Test 5: Image ID generation`);
      console.log(`User: ${uid}`);
      console.log(`Prompt: ${prompt}`);
      console.log(`Image ID 1: ${imageId1}`);
      console.log(`Image ID 2: ${imageId2}`);
      console.log(`Base part is same? ${imageId1.slice(0, 16) === imageId2.slice(0, 16) ? "✓ YES" : "✗ NO"}`);
      console.log(`Timestamp part is different? ${imageId1.slice(16) !== imageId2.slice(16) ? "✓ YES" : "✗ NO"}`);
      console.log();
    }, 10);
  }, 10);
}

// Add to window for console access
window.testHashFunctions = testHash;
