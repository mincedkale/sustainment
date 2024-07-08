import csv
from pandas import *

company_list = []
company_list_AX = []
company_stock_ticker = []
with open("companies-list.csv", 'r') as csvfile:
    data = csv.DictReader(csvfile)
    for row in data:
        company_list.append(row['Company'][:-10])
        company_list_AX.append(row['Company'][-4: -1] + '.AX')
        company_stock_ticker.append('ASX::' + row['Company'][-4: -1])

for i in range(50):
    print("('" + company_list[i] + ', ' + company_stock_ticker[i] + "'),")


