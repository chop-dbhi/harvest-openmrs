from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, \
    NoAlertPresentException
import unittest, time


class VerifyRemoveAllFiltersTest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.PhantomJS()
        self.driver.implicitly_wait(30)
        self.base_url = "http://0.0.0.0:8000/"
        self.verificationErrors = []
        self.accept_next_alert = True

    def test_verify_remove_all_filters(self):
        driver = self.driver
        driver.set_window_size(1440, 900)
        driver.get(self.base_url)
        driver.find_element_by_link_text("To The Demo!").click()
        for i in range(60):
            try:
                if self.is_element_present(By.CSS_SELECTOR, "div.heading"): break
            except: pass
            time.sleep(1)
        else: self.fail("time out")
        driver.find_element_by_xpath("//div[2]/div/div[2]/div").click()
        driver.find_element_by_link_text("Review of Systems").click()
        for i in range(60):
            try:
                if self.is_element_present(By.CSS_SELECTOR, "div.info-bar"): break
            except: pass
            time.sleep(1)
        else: self.fail("time out")
        for i in range(60):
            try:
                if self.is_element_present(By.CSS_SELECTOR, "#c8f56 > div.controls-region > div > div > div.control > div.bars-region > div.info-bar-chart > div.info-bar > div.bar-mask"): break
            except: pass
            time.sleep(1)
        else: self.fail("time out")
        driver.find_element_by_css_selector("div.bar-mask").click()
        driver.find_element_by_xpath("//div[@id='c8f52']/div[4]/div/div/div/div[3]/div/div/div[2]").click()
        driver.find_element_by_xpath("//div[3]/div[4]/div/div/div/div[3]/div/div/div[2]").click()
        driver.find_element_by_xpath("//div[4]/div[4]/div/div/div/div[3]/div/div/div[2]").click()
        driver.find_element_by_xpath("//div[5]/div[4]/div/div/div/div[3]/div/div/div[2]").click()
        driver.find_element_by_xpath("//div[6]/div[4]/div/div/div/div[3]/div/div/div[2]").click()
        driver.find_element_by_xpath("//div[@id='c8f51']/div[5]/button[2]").click()
        driver.find_element_by_xpath("//div[@id='c8f52']/div[5]/button[2]").click()
        driver.find_element_by_xpath("//div[@id='c8f53']/div[5]/button[2]").click()
        driver.find_element_by_xpath("//div[@id='c8f54']/div[5]/button[2]").click()
        driver.find_element_by_xpath("//div[@id='c8f55']/div[5]/button[2]").click()
        driver.find_element_by_xpath("//div[@id='c8f56']/div[5]/button[2]").click()
        driver.find_element_by_xpath("//div[@id='context-panel']/div/div/div/div/button").click()
        driver.find_element_by_xpath("//div[@id='c8f51']/div[4]/div/div/div/div[3]/div/div[2]/div[2]").click()
        driver.find_element_by_xpath("//div[@id='c8f51']/div[5]/button[2]").click()
        driver.find_element_by_xpath("//div[@id='c8f52']/div[5]/button[2]").click()
        driver.find_element_by_xpath("//div[@id='c8f53']/div[5]/button[2]").click()
        driver.find_element_by_xpath("//div[@id='c8f54']/div[5]/button[2]").click()
        driver.find_element_by_xpath("//div[@id='c8f55']/div[5]/button[2]").click()
        driver.find_element_by_xpath("//div[@id='c8f56']/div[5]/button[2]").click()
        driver.find_element_by_css_selector("div.context-filter > div > button.btn.btn-mini").click()
        driver.find_element_by_css_selector("div.context-filter > div > button.btn.btn-mini").click()
        driver.find_element_by_css_selector("div.context-filter > div > button.btn.btn-mini").click()
        driver.find_element_by_css_selector("div.context-filter > div > button.btn.btn-mini").click()
        driver.find_element_by_css_selector("div.context-filter > div > button.btn.btn-mini").click()
        driver.find_element_by_css_selector("div.context-filter > div > button.btn.btn-mini").click()

    def is_element_present(self, how, what):
        try:
            self.driver.find_element(by=how, value=what)
        except NoSuchElementException, e:
            return False
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
