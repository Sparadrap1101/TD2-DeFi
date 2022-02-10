const Str = require('@supercharge/strings')
// const BigNumber = require('bignumber.js');

var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20 = artifacts.require("DummyToken.sol"); 
var evaluator = artifacts.require("Evaluator.sol");
var myERC20 = artifacts.require("MyERC20.sol");
var mySolution = artifacts.require("MySolution.sol");
var uniswapFactory = artifacts.require("./IUniswapV2Factory.sol");


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        //await setPermissionsAndRandomValues(deployer, network, accounts); 
        //await deployRecap(deployer, network, accounts); 
		//await exo1(deployer, network, accounts);
		//await exo2(deployer, network, accounts);
        await deployMyERC20(deployer, network, accounts); 
        await testMyERC20Deploy(deployer, network, accounts); 
		await exo7(deployer, network, accounts);
    });
};

async function deployTDToken(deployer, network, accounts) {
	//TDToken = await TDErc20.new("TD-AMM-101","TD-AMM-101",web3.utils.toBN("20000000000000000000000000000"))
	TDToken = await TDErc20.at("0xc2269af51350796aF4F6D52e4736Db3A885F28D6");
	//dummyToken = await ERC20.new("dummyToken", "DTK", web3.utils.toBN("2000000000000000000000000000000"))
	dummyToken = await ERC20.at("0xbc3b69d1abd5a39f55a9ba50c7a2add933952123");
	uniswapV2FactoryAddress = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f";
	UniswapFactory = await uniswapFactory.at(uniswapV2FactoryAddress);
	wethAddress = "0xc778417e063141139fce010982780140aa0cd5ab";
}

async function deployEvaluator(deployer, network, accounts) {
	//Evaluator = await evaluator.new(TDToken.address, dummyToken.address, uniswapV2FactoryAddress, wethAddress)
	Evaluator = await evaluator.at("0x89a2Faa44066e94CE6B6D82927b0bbbb8709eEd7");
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
	randomSupplies = []
	randomTickers = []
	for (i = 0; i < 20; i++)
		{
		randomSupplies.push(Math.floor(Math.random()*1000000000))
		randomTickers.push(Str.random(5))
		// randomTickers.push(web3.utils.utf8ToBytes(Str.random(5)))
		// randomTickers.push(Str.random(5))
		}

	console.log(randomTickers)
	console.log(randomSupplies)
	// console.log(web3.utils)
	// console.log(type(Str.random(5)0)
	await Evaluator.setRandomTickersAndSupply(randomSupplies, randomTickers);
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("dummyToken " + dummyToken.address)
	console.log("Evaluator " + Evaluator.address)
}

async function exo1(deployer, network, accounts) {
	console.log("\n> Exo1: ", await Evaluator.exerciceProgression(accounts[0], 1));
	await Evaluator.ex1_showIHaveTokens();
	console.log("> Exo1: ", await Evaluator.exerciceProgression(accounts[0], 1));
}

async function exo2(deployer, network, accounts) {
	console.log("\n> Exo2: ", await Evaluator.exerciceProgression(accounts[0], 2));
	await Evaluator.ex2_showIProvidedLiquidity();
	console.log("> Exo2: ", await Evaluator.exerciceProgression(accounts[0], 2));
}

async function deployMyERC20(deployer, network, accounts) {
	await Evaluator.ex6a_getTickerAndSupply();
	const supply = await Evaluator.readSupply(accounts[0]);
	const ticker = await Evaluator.readTicker(accounts[0]);
	console.log("\n> Supply: ", supply.toString());
	console.log("> Ticker: ", ticker);
	MyERC20Token = await myERC20.new(ticker, ticker, supply);
	await Evaluator.submitErc20(MyERC20Token.address);
}

async function testMyERC20Deploy(deployer, network, accounts) {
	console.log("\n> Exo6: ", await Evaluator.exerciceProgression(accounts[0], 6));
	await Evaluator.ex6b_testErc20TickerAndSupply();
	console.log("> Exo6: ", await Evaluator.exerciceProgression(accounts[0], 6));
}

async function exo7(deployer, network, accounts) {
	console.log("\n> Exo7: ", await Evaluator.exerciceProgression(accounts[0], 7));
	console.log("Balance of my Tokens before : ", (await MyERC20Token.balanceOf(accounts[0])).toString());
	await MyERC20Token.mint(accounts[0], 1000000)
	console.log("Balance of my Tokens after : ", (await MyERC20Token.balanceOf(accounts[0])).toString());
	await UniswapFactory.createPair(MyERC20Token.address, wethAddress);
	await Evaluator.ex7_tokenIsTradableOnUniswap();
	console.log("> Exo7: ", await Evaluator.exerciceProgression(accounts[0], 7));
}