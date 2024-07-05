from companies import company_list_AX
from selenium import webdriver 
import pandas as pd
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from tqdm import tqdm
import requests, json
import time

URL = 'https://au.finance.yahoo.com/quote/'
companies = company_list_AX[:50]

driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
driver = webdriver.Chrome()
wait = WebDriverWait(driver, 5)

database_format = []

for company in companies:
    driver.get(URL + company)
    wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="render-target-default"]')))
    information = driver.find_elements(By.XPATH, '//*[@class="Ta(end) Fw(600) Lh(14px)"]')
    temp = "("
    last_info = information.pop()
    for info in information:
        temp += f"""'{info.text}', """
    temp += f"""'{last_info.text}')"""
    database_format.append(temp)
    
print(database_format)



driver.close()