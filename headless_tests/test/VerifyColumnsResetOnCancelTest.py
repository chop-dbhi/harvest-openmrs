import unittest, time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, \
    NoAlertPresentException


# In the columns dialog, after the under selects some columns and clicks cancel
# the columns should be reset upon opening the dialog again.
class VerifyColumnsResetOnCancelTest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.PhantomJS()
        self.driver.implicitly_wait(30)
        self.base_url = "http://0.0.0.0:8000/"
        self.verificationErrors = []
        self.accept_next_alert = True

    def test_verify_columns_reset_on_cancel(self):
        driver = self.driver
        driver.get(self.base_url)
        driver.find_element_by_link_text("To The Demo!").click()
        driver.find_element_by_link_text("Results").click()
        for i in range(60):
            try:
                if self.is_element_present(By.CSS_SELECTOR, "table"):
                    break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")
        driver.find_element_by_css_selector("button[data-toggle=\"columns-dialog\"]").click()
        for i in range(60):
            try:
                if self.is_element_present(By.CSS_SELECTOR, "button[data-action=\"add\"]"):
                    break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")
        driver.find_element_by_xpath("//div[@id='content']/div[4]/div[2]/div[2]/div/div/div[2]/div/div[2]/div[2]/div/div/ul/li[3]/button").click()
        driver.find_element_by_xpath("//div[@id='content']/div[4]/div[3]/button").click()
        for i in range(60):
            try:
                if self.is_element_present(By.CSS_SELECTOR, "table"):
                    break
            except:
                pass
            time.sleep(1)
        else: self.fail("time out")
        driver.find_element_by_css_selector("button[data-toggle=\"columns-dialog\"]").click()
        for i in range(60):
            try:
                if self.is_element_present(By.CSS_SELECTOR, "button[data-action=\"add\"]"):
                    break
            except:
                pass
            time.sleep(1)
        else: self.fail("time out")
        driver.find_element_by_xpath("//div[@id='content']/div[4]/div[2]/div[2]/div/div/div[2]/div/div[2]/div[2]/div/div/ul/li[4]/button").click()
        driver.find_element_by_xpath("//div[@id='content']/div[4]/div[2]/div[2]/div/div/div[2]/div/div[2]/div[2]/div/div/ul/li[5]/button").click()
        driver.find_element_by_xpath("//div[@id='content']/div[4]/div[3]/button[2]").click()
        for i in range(60):
            try:
                if self.is_element_present(By.CSS_SELECTOR, "table"):
                    break
            except:
                pass
            time.sleep(1)
        else: self.fail("time out")
        driver.find_element_by_css_selector("button[data-toggle=\"columns-dialog\"]").click()
        for i in range(60):
            try:
                if self.is_element_present(By.CSS_SELECTOR, "button[data-action=\"add\"]"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")
        driver.find_element_by_xpath("//div[@id='content']/div[4]/div[2]/div[2]/div/div[2]/div[2]/ul/li[4]/button").click()
        driver.find_element_by_xpath("//div[@id='content']/div[4]/div[2]/div[2]/div/div[2]/div[2]/ul/li[4]/button").click()
        driver.find_element_by_xpath("//div[@id='content']/div[4]/div[3]/button").click()
        for i in range(60):
            try:
                if self.is_element_present(By.CSS_SELECTOR, "table"): break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")
        driver.find_element_by_css_selector("button[data-toggle=\"columns-dialog\"]").click()
        for i in range(60):
            try:
                if self.is_element_present(By.CSS_SELECTOR, "button[data-action=\"add\"]"):
                    break
            except:
                pass
            time.sleep(1)
        else:
            self.fail("time out")
        driver.find_element_by_xpath("//div[@id='content']/div[4]/div[2]/div[2]/div/div[2]/div[2]/ul/li[4]/button").click()
        driver.find_element_by_xpath("//div[@id='content']/div[4]/div[2]/div[2]/div/div[2]/div[2]/ul/li[4]/button").click()
        driver.find_element_by_xpath("//div[@id='content']/div[4]/div[3]/button[2]").click()
        driver.find_element_by_css_selector("span.brand").click()

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
        finally:
            self.accept_next_alert = True

    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
