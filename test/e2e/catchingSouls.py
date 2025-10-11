import constants as const
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from dotenv import load_dotenv
import os

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 10)
load_dotenv()

class CatchingSouls:
    def __init__(self):
        self.driver = driver
        self.wait = wait
        super(CatchingSouls, self).__init__()

    def exit(self):
        # This method closes the browser window.
        try:
            self.driver.quit()
            print("✅ Browser closed successfully.")
        except Exception as e:
            print(f"❌ An error occurred while closing the browser: \n- {e}")

    def land_login_page(self):
        try:
            print("🚀 Launching Login page...")
            self.driver.get(const.BASE_URL + "/login")

            try:
                self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "login_form")))
                print("✅ Login form is present.")
            except:
                raise Exception("❌ Login form is not present.")
        except Exception as e:
            print(f"❌ An error occurred: \n- {e}")

    def loginAsRootAdmin(self):
        # This script automates the login process for a web application using Selenium.
        try:
            # Locate the username, password fields and login button
            username = self.driver.find_element(By.NAME, "username")
            password = self.driver.find_element(By.NAME, "password")
            login_btn = self.driver.find_element(By.CSS_SELECTOR, ".login_form .loginButton")

            # Fill in the login form
            username.send_keys(os.getenv("USERNAME"))
            password.send_keys(os.getenv("PASSWORD"))
            login_btn.click()

            # Wait for the dashboard to load after login
            try:
                self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "dashboard_form")))
                print("✅ Login successful, dashboard loaded.")
            except:
                raise Exception("❌ Login failed, dashboard did not load.")
        except Exception as e:
            print(f"❌ An error occurred: \n- {e}")

    def logout(self):
        # This method logs out the user from the application.
        try:
            logout_btn = self.driver.find_element(By.CSS_SELECTOR, ".headerBody .loginButton")
            logout_btn.click()

            # Wait for the logout page to load after logout
            try:
                self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "logout_form")))
                print("✅ Logout successful, logout page loaded.")
                
                print("⏳ Redirecting to login page in 5 seconds...")
                time.sleep(5)  # Optional: wait for a few seconds before redirecting
                
                logout_btn = self.driver.find_element(By.CSS_SELECTOR, ".logout_form a .logoutButton")
                logout_btn.click()

                try:
                    self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "login_form")))
                    print("✅ Login form is present after button click.")
                except:
                    raise Exception("❌ Login form is not present  after button click.")
            except:
                raise Exception("❌ Logout failed, logout page did not load.")
        except Exception as e:
            print(f"❌ An error occurred: \n- {e}")
