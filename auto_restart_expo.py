"""
Auto-Restart Expo Server - Automatically restarts the frontend if it crashes
"""
import subprocess
import time
import sys
import os
from datetime import datetime
from pathlib import Path

class ExpoService:
    def __init__(self):
        self.process = None
        self.should_run = True
        self.restart_count = 0
        self.max_restart_delay = 60
        self.log_file = Path(__file__).parent / "expo_service.log"
        
    def log(self, message):
        """Write to log file and console"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_message = f"[{timestamp}] {message}\n"
        
        print(log_message.strip())
        
        try:
            with open(self.log_file, "a", encoding="utf-8") as f:
                f.write(log_message)
        except Exception as e:
            print(f"Failed to write to log: {e}")
    
    def check_node_modules(self):
        """Check if node_modules exists"""
        node_modules = Path(__file__).parent / "node_modules"
        if not node_modules.exists():
            self.log("node_modules not found. Please run 'npm install' first!")
            return False
        return True
    
    def start_expo(self):
        """Start the Expo server process"""
        self.log("Starting Expo server...")
        
        try:
            # Use npm start to run expo
            self.process = subprocess.Popen(
                ["npm", "start"],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                cwd=Path(__file__).parent,
                shell=True
            )
            self.log(f"Expo started with PID: {self.process.pid}")
            return True
        except Exception as e:
            self.log(f"Failed to start Expo: {e}")
            return False
    
    def stop_expo(self):
        """Stop the Expo process"""
        if self.process:
            self.log("Stopping Expo...")
            try:
                self.process.terminate()
                self.process.wait(timeout=10)
                self.log("Expo stopped gracefully")
            except subprocess.TimeoutExpired:
                self.log("Expo didn't stop, force killing...")
                self.process.kill()
                self.process.wait()
                self.log("Expo force killed")
            except Exception as e:
                self.log(f"Error stopping Expo: {e}")
            finally:
                self.process = None
    
    def calculate_restart_delay(self):
        """Calculate delay before restart (exponential backoff)"""
        delay = min(5 * (2 ** min(self.restart_count, 3)), self.max_restart_delay)
        return delay
    
    def run(self):
        """Main service loop"""
        self.log("=" * 70)
        self.log("EXPO FRONTEND SERVICE STARTED")
        self.log("=" * 70)
        self.log("Service will auto-restart on crashes")
        self.log(f"Log file: {self.log_file}")
        self.log("=" * 70)
        
        # Check node_modules first
        if not self.check_node_modules():
            self.log("ERROR: Please install dependencies first!")
            self.log("Run: npm install")
            return
        
        while self.should_run:
            if not self.start_expo():
                self.log("Failed to start Expo, retrying in 10 seconds...")
                time.sleep(10)
                continue
            
            # Monitor the process
            try:
                # Read and log output
                for line in self.process.stdout:
                    print(line, end='')
                
                # Process has ended
                return_code = self.process.wait()
                
                if return_code != 0 and self.should_run:
                    self.restart_count += 1
                    delay = self.calculate_restart_delay()
                    self.log(f"Expo crashed (exit code: {return_code})")
                    self.log(f"Restart #{self.restart_count} in {delay} seconds...")
                    time.sleep(delay)
                else:
                    self.log("Expo stopped normally")
                    break
                    
            except KeyboardInterrupt:
                self.log("Interrupted by user")
                self.should_run = False
                self.stop_expo()
                break
            except Exception as e:
                self.log(f"Error monitoring Expo: {e}")
                if self.should_run:
                    self.log("Restarting in 5 seconds...")
                    time.sleep(5)
        
        self.log("Service stopped")

def main():
    """Entry point"""
    os.chdir(Path(__file__).parent)
    
    service = ExpoService()
    
    try:
        service.run()
    except KeyboardInterrupt:
        service.log("Interrupted by user")
        service.stop_expo()
    except Exception as e:
        service.log(f"Fatal error: {e}")
        service.stop_expo()
        sys.exit(1)

if __name__ == "__main__":
    main()
