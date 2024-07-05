from selenium import webdriver 
from companies import company_list
import pandas as pd
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from tqdm import tqdm
import time

# checking how long the API takes
start_time = time.time()

driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
driver = webdriver.Chrome()
wait = WebDriverWait(driver, 15) # create wait object which wait for 15s based on the condition
wait2 = WebDriverWait(driver, 10)
# need another web scraper to look at interesting companies

list_of_comapanies = company_list[:50]
industries = []
esg_rating = []
controversies = []
emmisions = []


def main():
    # gets rid of the cookies prompt
    driver.get("https://www.msci.com/our-solutions/esg-investing/esg-ratings-climate-search-tool/")
    wait.until(EC.element_to_be_clickable((By.ID, "onetrust-accept-btn-handler"))).click() # Click on Agree and Proceed button


    for i in range(3):
        company = list_of_comapanies.pop(0)
        navigate(company)
        get_information_of_company(company)

    company = list_of_comapanies.pop(0)
    navigate(company)
    fill_in_details()
    driver.switch_to.default_content()
    get_information_of_company(company)

    for company in list_of_comapanies:
        navigate(company)
        get_information_of_company(company)

    print("--- %s seconds ---" % (time.time() - start_time))
    print(industries)
    print(esg_rating)
    print(controversies)
    print(emmisions)

# log of what needs to be done
# get a list of australian companies
# get past the pop up on website

def navigate(company):
    driver.get("https://www.msci.com/our-solutions/esg-investing/esg-ratings-climate-search-tool/")

    search = wait.until(EC.element_to_be_clickable((By.XPATH, "//input[@class='msci-ac-search-input ui-autocomplete-input']")))
    search.send_keys(company)

    wait.until(EC.visibility_of_element_located((By.ID, "ui-id-1")))
    dropDownBox = driver.find_element(By.XPATH, "//*[@id='ui-id-1']/li[1]").click()

def get_information_of_company(company):
    """Gets the information about one company, including industry, esg grade and more"""
    industry = []
    emmision = []
    esg = []
    controversy = []

    # industry type

    wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="_esgratingsprofile_esg-ratings-profile-container"]/div[1]')))
    industry.append(get_text("//*[@id='_esgratingsprofile_esg-ratings-profile-container']/div[1]/div[2]/div[1]"))

    # CARBON: implied temperature rise (temperature alignment)
    wait.until(EC.element_to_be_clickable((By.XPATH,  '//*[@id="esg-commitment-toggle-link"]'))).click()
    for i in range(1,6):
        text = get_text(f'//*[@id="esg-commitment-toggle"]/div/div[1]/div/div[2]/div[{i}]').replace("\n", ' ')
        emmision.append(text)
        if ((text.replace("\n", ' '))[-2:] == 'NO'):
            break
    emmision.append(get_text_in_tab("//*[@id='esg-climate-toggle-link']", "//*[@id='_esgratingsprofile_esg-company-transparency']/div[1]/div[3]/span"))
    emmision[-1] += f""", {get_text("//*[@id='_esgratingsprofile_esg-company-transparency']/div[2]/span")}"""

    # ESG
    # esg rating
    esg.append(get_class_in_tab('//*[@id="esg-transparency-toggle-link"]', '//*[@id="_esgratingsprofile_esg-ratings-profile-header"]/div/div[1]/div[2]/div')[-3:].strip("e-"))
    # ESG laggard, average, leader
    esg.append("Laggard: " + get_text('//*[@id="_esgratingsprofile_esg-ratings-profile-industry-comparison"]/div[3]/div[1]/div[2]').replace('\n', ' | '))
    esg.append("Average: " + get_text('//*[@id="_esgratingsprofile_esg-ratings-profile-industry-comparison"]/div[3]/div[2]/div[2]').replace('\n', ' | '))
    esg.append("Leader: " + get_text('//*[@id="_esgratingsprofile_esg-ratings-profile-industry-comparison"]/div[3]/div[3]/div[2]').replace('\n', ' | '))
    
    # SOCIAL
    i = 1
    wait.until(EC.element_to_be_clickable((By.XPATH,  '//*[@id="esg-controversies-toggle-link"]'))).click()
    while element_visible(f'//*[@id="controversies-table"]/div[{i}]'):
        element = driver.find_element(By.XPATH, f'//*[@id="controversies-table"]/div[{i}]')
        name = element.get_attribute('innerText')
        rating = element.get_attribute('class')
        if rating[-3:] == 'Red':
            rating = 'Red'
        else:
            rating = rating[-6:].strip('-')
        controversy.append(name + ': ' + rating)
        i += 1

    industries.append(industry)
    emmisions.append(emmision)
    esg_rating.append(esg)
    controversies.append(controversy)


def element_visible(XPATH):
    try:
        driver.find_element(By.XPATH, XPATH)
        return True
    except:
        return False


def get_text(xpath):
    """find one piece of text about the company, such as industry"""
    wait.until(EC.visibility_of_element_located((By.XPATH, xpath)))
    information = driver.find_element(By.XPATH, xpath)

    return information.text

def get_text_in_tab(xpathoftab, xpathofinfo):
    """gets information about an image about a company, such as the climate alignment, which is in a tab"""
    wait.until(EC.element_to_be_clickable((By.XPATH, xpathoftab))).click()
    return get_text(xpathofinfo)

def get_class(xpath):
    """get the info stored in a class"""
    wait.until(EC.visibility_of_element_located((By.XPATH, xpath)))
    information = driver.find_element(By.XPATH, xpath)

    return information.get_attribute("class")

def get_class_in_tab(xpathoftab, xpathofinfo):
    """gets class information which is stored in a tab that have to be clicked"""
    wait.until(EC.element_to_be_clickable((By.XPATH, xpathoftab))).click()
    return get_class(xpathofinfo)

def send_input(XPATH, string):
    wait.until(EC.visibility_of_element_located((By.XPATH, XPATH)))
    temp = wait.until(EC.element_to_be_clickable((By.XPATH, XPATH)))
    temp.send_keys(string)

def fill_in_details():
    iframe = wait.until(EC.presence_of_element_located((By.XPATH, '//*[@id="_esgratingsprofile_subscriptionFormPopup_iframe_"]')))
    driver.switch_to.frame(iframe)
    wait2.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="main-content"]')))
    send_input('//*[@id="_esgratingsprofile_firstName"]', 'Max')
    send_input('//*[@id="_esgratingsprofile_lastName"]', 'Wane')
    send_input('//*[@id="_esgratingsprofile_jobTitle"]', 'Accountant')
    send_input('//*[@id="_esgratingsprofile_email"]', 'boxohe8043@cutxsew.com')
    send_input('//*[@id="_esgratingsprofile_company"]', 'cutxsew')
    wait2.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="_esgratingsprofile_CliCS_Segment"]/option[2]'))).click()
    wait2.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="_esgratingsprofile_Primary_Area_Of_Interest"]/option[2]'))).click()
    wait2.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="_esgratingsprofile_country"]/option[2]'))).click()
    wait2.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="_esgratingsprofile_esgRatingsSubscriptionForm"]/div/div[2]/div/label/span'))).click()
    wait2.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="_esgratingsprofile_submitButton"]/span'))).click()
    wait2.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="_esgratingsprofile_submitButton"]/span'))).click()

    

main()