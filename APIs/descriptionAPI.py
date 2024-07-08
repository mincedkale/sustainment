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

URL = 'https://www.google.com.au/search?q=h&sca_esv=e561d0ec59a4f4d7&source=hp&ei=SdCGZsbpC6PEvr0PyqiFuA8&iflsig=AL9hbdgAAAAAZobeWcULgaLPCMNp5bMN4ZyPnJusoDuM&ved=0ahUKEwiGssO96Y2HAxUjoq8BHUpUAfcQ4dUDCA8&uact=5&oq=h&gs_lp=Egdnd3Mtd2l6IgFoMgsQABiABBixAxiDATIREC4YgAQYsQMY0QMYgwEYxwEyERAuGIAEGLEDGNEDGIMBGMcBMg4QABiABBixAxiDARiKBTIUEC4YgAQYsQMY0QMYgwEYxwEYigUyDhAAGIAEGLEDGIMBGIoFMgsQABiABBixAxiDATILEAAYgAQYsQMYgwEyERAuGIAEGLEDGNEDGIMBGMcBMhEQLhiABBixAxjRAxiDARjHAUjfAlAAWABwAHgAkAEAmAGYAaABmAGqAQMwLjG4AQPIAQD4AQGYAgGgAp8BmAMAkgcDMC4xoAfYDQ&sclient=gws-wiz'
companies = company_list_AX[:50]

driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
driver = webdriver.Chrome()
wait = WebDriverWait(driver, 5)

# //*[@id="rso"]/div[1]/div/block-component/div/div[1]/div/div/div/div/div[1]/div/div/div/div/div[1]/div/span/spans


for company in companies:
    driver.get('https://www.google.com/search?q=wiki&sca_esv=e561d0ec59a4f4d7&sca_upv=1&ei=g9GGZsm_Ot7h2roPgu-WoAg&ved=0ahUKEwiJjc_T6o2HAxXesFYBHYK3BYQQ4dUDCA8&uact=5&oq=wiki&gs_lp=Egxnd3Mtd2l6LXNlcnAiBHdpa2kyCxAAGIAEGJECGIoFMg0QABiABBixAxhDGIoFMhAQABiABBixAxhDGIMBGIoFMgsQABiABBiRAhiKBTIKEAAYgAQYQxiKBTILEAAYgAQYsQMYgwEyChAAGIAEGEMYigUyDhAuGIAEGLEDGNEDGMcBMggQABiABBixAzIIEAAYgAQYsQNI7wxQhQlYpApwAHgDkAEAmAHdAaABkQOqAQUwLjEuMbgBA8gBAPgBAZgCA6ACvgHCAgQQABhHmAMA4gMFEgExIECIBgGQBgiSBwMyLjGgB9kP&sclient=gws-wiz-serp')
    search = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="APjFqb"]')))
    search.send_keys(" " + company[:3] + ' description')
    wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="tsf"]/div[1]/div[1]/div[2]/button'))).click()
    time.sleep(5)