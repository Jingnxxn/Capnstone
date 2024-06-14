// fetchData.ts 파일

export function fetchData() {
    return fetch('https://api.example.com/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(data => {
            // 데이터를 처리하는 코드
            console.log(data);
            return data;
        })
        .catch(error => {
            // 에러 처리 코드
            console.error('Error fetching data:', error);
        });
}
