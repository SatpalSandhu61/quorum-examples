//Generate the signed transaction data for some data

const ethTx = require('ethereumjs-tx');

var data = 'vSytDW2H/qyQEB4BBn1zbfH4eKE0eirMAs2V4RNg2KCeDh7ijrKP+LhTJ9eXCk2/ncsNGw7UQH5Jdhz49QHytA=='

const txParams = {
nonce: '37',	//<<<<next nonce
gasPrice: '0x00',
gasLimit: '0x47b760',
to: '0x131f110145a704e028bca7b85eae33e32f94097c',	//<<<<contract addr
value: '0x00',
from:'0xed9d02e382b34818e88b88a309c7fe71e65f419d',	//<<<<addr to sign
data:data
};

const tx = new ethTx(txParams);
const privKey = Buffer.from('e6181caaffff94a09d7e332fc8da9884d99902c7874eb74354bdcadf411929f1', 'hex');	//<<<<Private key of the account

// Sign the transaction
tx.sign(privKey);
const serializedTx = tx.serialize();
const rawTx = '0x' + serializedTx.toString('hex');
console.log(rawTx);

