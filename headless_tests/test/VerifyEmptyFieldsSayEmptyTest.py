from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import unittest, time, re


class VerifyEmptyFieldsSayEmptyTest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.PhantomJS()
        self.driver.implicitly_wait(30)
        self.base_url = "http://0.0.0.0:8000/"
        self.verificationErrors = []
        self.accept_next_alert = True

    def test_verify_empty_fields_say_empty(self):
        driver = self.driver
        driver.get(self.base_url)
        driver.find_element_by_link_text("To The Demo!").click()
        for i in range(60):
            try:
                if self.is_element_present(By.CSS_SELECTOR, "div.heading"):
                    break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")
        driver.find_element_by_css_selector("div.heading").click()
        driver.find_element_by_link_text("Gender").click()
        for i in range(60):
            try:
                if self.is_element_present(By.XPATH, "//div[3]/div/div[3]/div[2]"):
                    break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")
        driver.find_element_by_xpath("//div[3]/div/div[3]/div[2]").click()
        self.assertEqual("(empty) 1 (<1%)", driver.find_element_by_xpath("//div[3]/div/div[3]/div[2]").text)
        driver.find_element_by_css_selector("span.brand").click()

    def is_element_present(self, how, what):
        try:
            self.driver.find_element(by=how, value=what)
        except NoSuchElementException, e:
            return False
        return True

    def is_alert_present(self):
        try:
            self.driver.switch_to_alert()
        except NoAlertPresentException, e:
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
        finally:
            self.accept_next_alert = True

    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
