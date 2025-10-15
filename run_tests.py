#!/usr/bin/env python3
"""
Test runner script for the emoji-speech-translator project.
"""
import subprocess
import sys
from pathlib import Path

def run_tests():
    """Run all tests or specific test categories."""
    project_root = Path(__file__).parent
    
    # Change to project directory
    import os
    os.chdir(project_root)
    
    # Run all tests
    print("Running all tests...")
    result = subprocess.run([sys.executable, "-m", "pytest", "tests/", "-v"], 
                          capture_output=False)
    
    if result.returncode == 0:
        print("\n✅ All tests passed!")
    else:
        print("\n❌ Some tests failed!")
        return result.returncode
    
    # Run only performance tests
    print("\nRunning performance tests only...")
    result = subprocess.run([sys.executable, "-m", "pytest", "tests/", "-m", "performance", "-v"], 
                          capture_output=False)
    
    if result.returncode == 0:
        print("\n✅ Performance tests passed!")
    else:
        print("\n❌ Performance tests failed!")
        return result.returncode
    
    return 0

if __name__ == "__main__":
    sys.exit(run_tests())
