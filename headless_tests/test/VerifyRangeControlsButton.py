from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, \
    NoAlertPresentException
import unittest, time


class VerifyRangeControlsButton(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.PhantomJS()
        self.driver.implicitly_wait(30)
        self.base_url = "http://localhost:8000/"
        self.verificationErrors = []
        self.accept_next_alert = True

    def test_verify_range_controls_button(self):
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
        driver.find_element_by_xpath("//div[3]/div").click()
        driver.find_element_by_link_text("Hemoglobin (HGB)").click()
        driver.find_element_by_css_selector("input.range-lower").clear()
        driver.find_element_by_css_selector("input.range-lower").send_keys("3")
        driver.find_element_by_css_selector("input.range-lower").clear()
        self.assertEqual(driver.find_element_by_xpath("//div[@id='c28f30']/div[5]/button").is_enabled(), False)

    def is_element_present(self, how, what):
        try:
            self.driver.find_element(by=how, value=what)
        except NoSuchElementException:
            return False
        return True

    def is_alert_present(self):
        try:
            self.driver.switch_to_alert()
        except NoAlertPresentException:
            return False
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
