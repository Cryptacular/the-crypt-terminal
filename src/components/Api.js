const apiEndpoint = 'https://the-crypt-api-uyxyqpgepo.now.sh';

export const wakeApi = () => {
    return fetch(apiEndpoint);
}

export const getBlogPosts = () => {
    return fetch(`${apiEndpoint}/posts`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}