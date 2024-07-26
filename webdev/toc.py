import requests
import json

user = 'Dexin09'
repo = 'Year-10_Media-Arts'
base_url = f'https://api.github.com/repos/{user}/{repo}/contents/'
output_file = 'webdev/toc.json'

def fetch_repo_contents(path=''):
    url = base_url + path
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def generate_toc(path=''):
    contents = fetch_repo_contents(path)
    toc = []
    for item in contents:
        toc_item = {
            'name': item['name'],
            'path': item['path'],
            'type': item['type']
        }
        if item['type'] == 'dir':
            toc_item['contents'] = generate_toc(item['path'])
        toc.append(toc_item)
    return toc

def main():
    toc = generate_toc()
    with open(output_file, 'w') as f:
        json.dump(toc, f, indent=2)

if __name__ == '__main__':
    main()
