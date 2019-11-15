App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  url: 'http://127.0.0.1:7545',
  chairPerson: null,
  currentAccount: null,
  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);

    ethereum.enable();

    App.populateAddress();
    return App.initContract();
  },

  initContract: function () {
    $.getJSON('DogShow.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var voteArtifact = data;
      App.contracts.vote = TruffleContract(voteArtifact);

      // Set the provider for our contract
      App.contracts.vote.setProvider(App.web3Provider);

      App.getChairperson();
      App.render();
      return App.bindEvents();
    });
  },

  render: function () {
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html(account);
      }
    });
  },

  bindEvents: function () {
    // scoring functions
    $(document).on('click', '.gen-app-btn', App.handleGenAppScore);

    $(document).on('click', '.head-btn', App.handleHeadScore);

    $(document).on('click', '.body-btn', App.handleBodyScore);

    $(document).on('click', '.forq-btn', App.handleForqScore);

    $(document).on('click', '.coat-btn', App.handleCoatScore);

    $(document).on('click', '.hindq-btn', App.handleHindqScore);

    // win calc function
    $(document).on('click', '.winner-btn', App.handleWinner);

    // register function
    $(document).on('click', '#register', function () {
      var addr = $("#enter_address option:selected").val();
      App.handleRegister(addr);
    });
  },

  populateAddress: function () {
    new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
      jQuery.each(accounts, function (i) {
        if (web3.eth.coinbase != accounts[i]) {
          var optionElement = '<option value="' + accounts[i] + '">' + accounts[i] + '</option';
          jQuery('#enter_address').append(optionElement);
        }
      });
    });
  },

  getChairperson: function () {
    App.contracts.vote.deployed().then(function (instance) {
      return instance;
    }).then(function (result) {
      App.chairPerson = result.constructor.currentProvider.selectedAddress.toString();
      App.currentAccount = web3.eth.coinbase;
      // if (App.currentAccount != App.chairPerson) {
      //   console.log(App.currentAccount);
      //   content.hide();
      // } else {
      //   (App.chairPerson);
      //   content.show();
      // }
    })
  },

  handleRegister: function (addr) {
    var contractInstance;
    App.contracts.vote.deployed().then(function (instance) {
      contractInstance = instance;
      return contractInstance.register(addr);
    }).then(function (result, err) {
      if (result) {
        if (parseInt(result.receipt.status) == 1)
          alert(addr + " registration done successfully")
        else
          alert(addr + " registration not done successfully due to revert")
      } else {
        alert(addr + " registration failed")
      }
    });
  },

  handleWinner: function () {
    console.log("To get winner");
    var contractInstance;
    App.contracts.vote.deployed().then(function (instance) {
      contractInstance = instance;
      return contractInstance.collectWinner();
    }).then(function (res) {
      console.log(res);
      if (res == 1) {
        alert("Lola is the winner!");
      } else if (res == 2) {
        alert("Toby is the winner!");
      } else if (res == 3) {
        alert("Buddy is the winner!");
      } else if (res == 4) {
        alert("Maggie is the winner!");
      } else if (res == 5) {
        alert("Riley is the winner!");
      } else if (res == 6) {
        alert("Max is the winner!");
      } else {
        alert("Coco is the winner!");
      }
    }).catch(function (err) {
      console.log(err.message);
    })
  },

  handleGenAppScore: function (event) {
    event.preventDefault();
    var score = $("#enter_score option:selected").val();
    var dogId = parseInt($(event.target).data('id'));
    console.log(dogId);
    var contractInstance;

    web3.eth.getAccounts(function (error, accounts) {
      var account = accounts[0];
      console.log(account);
      App.contracts.vote.deployed().then(function (instance) {
        contractInstance = instance;
        return contractInstance.generalAppearanceScore(score, dogId, {
          from: account
        });
      }).then(function (result, err) {
        if (result) {
          console.log(result.receipt.status);
          if (parseInt(result.receipt.status) == 1)
            alert(account + " voting done successfully")
          else
            alert(account + " voting not done successfully due to revert")
        } else {
          alert(account + " voting failed")
        }
      });
    });
  },

  handleHeadScore: function (event) {
    event.preventDefault();
    var score = $("#enter_score option:selected").val();
    var dogId = parseInt($(event.target).data('id'));
    var contractInstance;

    web3.eth.getAccounts(function (error, accounts) {
      var account = accounts[0];
      App.contracts.vote.deployed().then(function (instance) {
        contractInstance = instance;
        return contractInstance.headScore(score, dogId, {
          from: account
        });
      }).then(function (result, err) {
        if (result) {
          console.log(result.receipt.status);
          if (parseInt(result.receipt.status) == 1)
            alert(account + " voting done successfully")
          else
            alert(account + " voting not done successfully due to revert")
        } else {
          alert(account + " voting failed")
        }
      });
    });
  },

  handleBodyScore: function (event) {
    event.preventDefault();
    var score = $("#enter_score option:selected").val();
    var dogId = parseInt($(event.target).data('id'));
    var contractInstance;

    web3.eth.getAccounts(function (error, accounts) {
      var account = accounts[0];
      App.contracts.vote.deployed().then(function (instance) {
        contractInstance = instance;
        return contractInstance.bodyScore(score, dogId, {
          from: account
        });
      }).then(function (result, err) {
        if (result) {
          console.log(result.receipt.status);
          if (parseInt(result.receipt.status) == 1)
            alert(account + " voting done successfully")
          else
            alert(account + " voting not done successfully due to revert")
        } else {
          alert(account + " voting failed")
        }
      });
    });
  },

  handleForqScore: function (event) {
    event.preventDefault();
    var score = $("#enter_score option:selected").val();
    var dogId = parseInt($(event.target).data('id'));
    var contractInstance;

    web3.eth.getAccounts(function (error, accounts) {
      var account = accounts[0];
      App.contracts.vote.deployed().then(function (instance) {
        contractInstance = instance;
        return contractInstance.forequarterScore(score, dogId, {
          from: account
        });
      }).then(function (result, err) {
        if (result) {
          console.log(result.receipt.status);
          if (parseInt(result.receipt.status) == 1)
            alert(account + " voting done successfully")
          else
            alert(account + " voting not done successfully due to revert")
        } else {
          alert(account + " voting failed")
        }
      });
    });
  },

  handleCoatScore: function (event) {
    event.preventDefault();
    var score = $("#enter_score option:selected").val();
    var dogId = parseInt($(event.target).data('id'));
    var contractInstance;

    web3.eth.getAccounts(function (error, accounts) {
      var account = accounts[0];
      App.contracts.vote.deployed().then(function (instance) {
        contractInstance = instance;
        return contractInstance.coatScore(score, dogId, {
          from: account
        });
      }).then(function (result, err) {
        if (result) {
          console.log(result.receipt.status);
          if (parseInt(result.receipt.status) == 1)
            alert(account + " voting done successfully")
          else
            alert(account + " voting not done successfully due to revert")
        } else {
          alert(account + " voting failed")
        }
      });
    });
  },

  handleHindqScore: function (event) {
    event.preventDefault();
    var score = $("#enter_score option:selected").val();
    var dogId = parseInt($(event.target).data('id'));
    var contractInstance;

    web3.eth.getAccounts(function (error, accounts) {
      var account = accounts[0];
      App.contracts.vote.deployed().then(function (instance) {
        contractInstance = instance;
        return contractInstance.hindquarterScore(score, dogId, {
          from: account
        });
      }).then(function (result, err) {
        if (result) {
          console.log(result.receipt.status);
          if (parseInt(result.receipt.status) == 1)
            alert(account + " voting done successfully")
          else
            alert(account + " voting not done successfully due to revert")
        } else {
          alert(account + " voting failed")
        }
      });
    });
  }
};

$(function () {
  $(window).on('load', function () {
    App.init();
  });
});