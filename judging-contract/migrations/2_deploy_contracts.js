var dogShow = artifacts.require("DogShow");

module.exports = function(deployer) {
    deployer.deploy(dogShow, 4);
};