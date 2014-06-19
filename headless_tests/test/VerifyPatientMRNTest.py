from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException, \
    NoAlertPresentException
import unittest, time, re

class VerifyPatientMRNTest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.PhantomJS()
        self.driver.implicitly_wait(30)
        self.base_url = "http://127.0.0.1:8000/"
        self.verificationErrors = []
        self.accept_next_alert = True

    def test_verify_patient_m_r_n(self):
        driver = self.driver
        driver.get(self.base_url)
        driver.find_element_by_link_text("To The Demo!").click()
        for i in range(60):
            try:
                if self.is_element_present(By.CSS_SELECTOR, "div.heading"): break
            except: pass
            time.sleep(1)
        else: self.fail("time out")
        driver.find_element_by_css_selector("div.heading").click()
        driver.find_element_by_link_text("MRN").click()
        for i in range(60):
            try:
                if self.is_element_present(By.CSS_SELECTOR, "div.value-item"): break
            except: pass
            time.sleep(1)
        else: self.fail("time out")
        driver.find_element_by_xpath("//div[@id='c65f83']/div[4]/div/div/div/div/div/div[3]/div/div/div/div/button").click()
        driver.find_element_by_xpath("//div[@id='c65f83']/div[4]/div/div/div/div/div/div[3]/div/div/div[2]/div/button").click()
        driver.find_element_by_xpath("//div[@id='c65f83']/div[4]/div/div/div/div/div/div[3]/div/div/div[3]/div/button").click()
        driver.find_element_by_xpath("//div[@id='c65f83']/div[4]/div/div/div/div/div/div[3]/div/div/div[4]/div/button").click()
        driver.find_element_by_xpath("//div[@id='c65f83']/div[4]/div/div/div/div/div/div[3]/div/div/div[5]/div/button").click()
        driver.find_element_by_xpath("//div[@id='c65f83']/div[4]/div/div/div/div/div/div[3]/div/div/div[6]/div/button").click()
        driver.find_element_by_xpath("//div[@id='c65f83']/div[4]/div/div/div/div/div/div[3]/div/div/div[7]/div/button").click()
        driver.find_element_by_xpath("//div[@id='c65f83']/div[4]/div/div/div/div/div/div[3]/div/div/div[8]/div/button").click()
        driver.find_element_by_xpath("//div[@id='c65f83']/div[4]/div/div/div/div/div/div[3]/div/div/div[9]/div/button").click()
        driver.find_element_by_xpath("//div[@id='c65f83']/div[4]/div/div/div/div/div/div[3]/div/div/div[10]/div/button").click()
        driver.find_element_by_xpath("//div[@id='c65f83']/div[5]/button[2]").click()
        driver.find_element_by_css_selector("button.close").click()
        driver.find_element_by_css_selector("span.brand").click()

    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException, e: return False
        return True

    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException, e: return False
        return True

    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True

    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
