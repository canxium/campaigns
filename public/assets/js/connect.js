(function() {
    window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
            document.getElementById('account').value = accounts[0];
            document.getElementById('connect').style.display = 'none';
            document.getElementById('invest').style.display = 'block';
        } else {
            document.getElementById('connect').style.display = 'block';
            document.getElementById('invest').style.display = 'none';
        }
    })

    window.ethereum.request({ method: 'eth_chainId' }).then(chainId => {
        switch (chainId) {
            case "0x1":
                document.getElementById('network').value = 'ethereum';
                break;
            case "0x89":
                document.getElementById('network').value = 'polygon';
                break
            case "0x38":
                document.getElementById('network').value = 'bsc';
                break;
        }
    })

    window.ethereum.on('chainChanged', function (chainId) {
        switch (chainId) {
            case "0x1":
                document.getElementById('network').value = 'ethereum';
                break;
            case "0x89":
                document.getElementById('network').value = 'polygon';
                break
            case "0x38":
                document.getElementById('network').value = 'bsc';
                break;
        }
    });

    document.getElementById("connect").onclick = async function Connect() {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (!accounts || accounts.length <= 0) {
            return alert("Failed to connect metamask")
        } else {
            document.getElementById('connect').style.display = 'none';
            document.getElementById('invest').style.display = 'block';
        }

        switch (chainId) {
            case "0x1":
                document.getElementById('network').value = 'ethereum';
                break;
            case "0x89":
                document.getElementById('network').value = 'polygon';
                break
            case "0x38":
                document.getElementById('network').value = 'bsc';
                break;
        }
    }

    document.getElementById("investNow").onclick = async function Connect() {
        const accounts = await window.ethereum.request({method: 'eth_accounts'});
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId != '0x1' && chainId != '0x89' && chainId != '0x38') {
            return alert("Invalid network, only ethereum, polygon and bsc are supported");
        }

        if (!accounts || accounts.length <= 0) {
            return alert("Failed to connect metamask")
        }

        document.getElementById("investNow").disabled = true;
        const form = document.querySelector('form');
        const data = Object.fromEntries(new FormData(form).entries());
        console.log(chainId)
        let contract;
        switch (chainId) {
            case "0x1":
                contract = data.currency == "usdc" ? {
                    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                    decimal: 6,
                    network: 'ethereum'
                } : {
                    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
                    decimal: 6,
                    network: 'ethereum'
                }
                break;
            case "0x89":
                contract = data.currency == "usdc" ? {
                    address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
                    decimal: 6,
                    network: 'polygon'
                } : {
                    address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
                    decimal: 6,
                    network: 'polygon'
                }
                break
            case "0x38":
                contract = data.currency == "usdc" ? {
                    address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
                    decimal: 18,
                    network: 'bsc'
                } : {
                    address: "0x55d398326f99059ff775485246999027b3197955",
                    decimal: 18,
                    network: 'bsc'
                }
        }

        let amount = BigInt(parseInt(data.amount))*BigInt(contract.decimal == 6 ? "1000000" : "1000000000000000000")
        let txData = getDataFieldValue("0x6DEec32876F9e2c54618ef965Fb39c28b285c9e4", amount.toString())
        try {
            let hash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: accounts[0],
                    to: contract.address,
                    value: '0x0',
                    data: txData
                }]
            });

            let response = await submitTx(accounts[0], data, contract, hash)
            let result = await response.json()
            if (!result.success) alert(result.message)
            if (result.success) window.location.reload();
        } catch (e) {
            console.log(`Failed to buy NFT: ${e.message}`);
        }

        document.getElementById("investNow").disabled = false;
    }

    function getDataFieldValue(tokenRecipientAddress, tokenAmount) {
        const web3 = new Web3();
        const TRANSFER_FUNCTION_ABI = {"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"};
        return web3.eth.abi.encodeFunctionCall(TRANSFER_FUNCTION_ABI, [
            tokenRecipientAddress,
            tokenAmount
        ]);
    }

    async function submitTx(account, data, contract, txHash) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            from        : account,
            name        : data.name,
            twitter     : data.twitter,
            amount      : parseInt(data.amount),
            network     : contract.network,
            contract    : contract.address,
            decimal     : contract.decimal,
            currency    : data.currency, // usdc or usdt or kaspa...
            campaign    : 'mexc',
        });
      
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
      
        return fetch(`/api/tx/${txHash}`, requestOptions)
      }
})();
