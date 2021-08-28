async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
}

export { requestAccount };