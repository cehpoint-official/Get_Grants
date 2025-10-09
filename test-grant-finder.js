// Simple test script to verify the Smart Grant Finder setup
// Run this in the browser console on your admin dashboard

console.log("Testing Smart Grant Finder Setup...");

// Test 1: Check if sourceWebsites collection is accessible
async function testSourceWebsites() {
    try {
        const { collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('./client/src/lib/firebase.js');
        
        const snapshot = await getDocs(collection(db, 'sourceWebsites'));
        console.log("✅ Source websites collection accessible");
        console.log(`Found ${snapshot.size} source websites`);
        return true;
    } catch (error) {
        console.error("❌ Error accessing sourceWebsites:", error);
        return false;
    }
}

// Test 2: Check if pendingGrants collection is accessible
async function testPendingGrants() {
    try {
        const { collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('./client/src/lib/firebase.js');
        
        const snapshot = await getDocs(collection(db, 'pendingGrants'));
        console.log("✅ Pending grants collection accessible");
        console.log(`Found ${snapshot.size} pending grants`);
        return true;
    } catch (error) {
        console.error("❌ Error accessing pendingGrants:", error);
        return false;
    }
}

// Test 3: Check if admin dashboard sections are loaded
function testAdminSections() {
    const sidebarItems = document.querySelectorAll('[data-testid="sidebar-item"]');
    const hasManageSources = Array.from(sidebarItems).some(item => 
        item.textContent.includes('Manage Sources')
    );
    const hasGrantDrafts = Array.from(sidebarItems).some(item => 
        item.textContent.includes('Grant Drafts')
    );
    
    if (hasManageSources && hasGrantDrafts) {
        console.log("✅ Admin dashboard sections loaded correctly");
        return true;
    } else {
        console.error("❌ Admin dashboard sections missing");
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log("Starting Smart Grant Finder tests...\n");
    
    const test1 = await testSourceWebsites();
    const test2 = await testPendingGrants();
    const test3 = testAdminSections();
    
    console.log("\nTest Results:");
    console.log(`Source Websites: ${test1 ? 'PASS' : 'FAIL'}`);
    console.log(`Pending Grants: ${test2 ? 'PASS' : 'FAIL'}`);
    console.log(`Admin Sections: ${test3 ? 'PASS' : 'FAIL'}`);
    
    if (test1 && test2 && test3) {
        console.log("\n🎉 All tests passed! Smart Grant Finder is ready to use.");
    } else {
        console.log("\n⚠️ Some tests failed. Please check the setup.");
    }
}

// Run tests when script loads
runTests();
