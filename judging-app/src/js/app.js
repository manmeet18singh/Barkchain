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
      return App.bindEvents();
    });
  },

  bindEvents: function () {
    // scoring functions
    $(document).on('click', '.gen-app-btn',
      // var score = $("#enter_score option:selected").val();
      App.handleGenAppScore
    );
    $(document).on('click', '.head-btn', function () {
      var score = $("#enter_score option:selected").val();
      App.handleHeadScore(score);
    });
    $(document).on('click', '.body-btn', function () {
      var score = $("#enter_score option:selected").val();
      App.handleBodyScore(score);
    });
    $(document).on('click', '.forq-btn', function () {
      var score = $("#enter_score option:selected").val();
      App.handleForqScore(score);
    });
    $(document).on('click', '.coat-btn', function () {
      var score = $("#enter_score option:selected").val();
      App.handleCoatScore(score);
    });
    $(document).on('click', '.hindq-btn', function () {
      var score = $("#enter_score option:selected").val();
      App.handleHindqScore(score)
    });

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

  getChairperson : function(){
    App.contracts.vote.deployed().then(function(instance) {
      return instance;
    }).then(function(result) {
      App.chairPerson = result.constructor.currentProvider.selectedAddress.toString();
      App.currentAccount = web3.eth.coinbase;
    })
  },

  handleRegister: function(addr){
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.register(addr);
    }).then(function(result, err){
        if(result){
            if(parseInt(result.receipt.status) == 1)
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
    var voteInstance;
    App.contracts.vote.deployed().then(function (instance) {
      voteInstance = instance;
      return voteInstance.reqWinner();
    }).then(function (res) {
      console.log(res);
      alert(App.names[res] + "  is the winner ! :)");
    }).catch(function (err) {
      console.log(err.message);
    })
  },


  handleGenAppScore: function (event) {
    event.preventDefault();
    var score = $("#enter_score option:selected").val();

    // TODO: you need data-id="0,1,2,3,4..." in the button tags in the html for proposal id to work

    var proposalId = parseInt($(event.target).data('id'));

    console.log(proposalId)

    var voteInstance;

    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];

      App.contracts.vote.deployed().then(function(instance) {
        voteInstance = instance;

        return voteInstance.generalAppearanceScore(proposalId, {from: account});
      }).then(function(result, err){
            if(result){
                console.log(result.receipt.status);
                if(parseInt(result.receipt.status) == 1)
                alert(account + " voting done successfully")
                else
                alert(account + " voting not done successfully due to revert")
            } else {
                alert(account + " voting failed")
            }   
        });
    });
  },

  handleHeadScore: function (score) {
    web3.eth.getAccounts(function (error, accounts) {
      var account = accounts[0];

      App.contracts.vote.deployed().then(function (instance) {
        voteInstance = instance;

        return voteInstance.generalAppearanceScore(score, {
          from: account
        });
      }).then(function (result, err) {
        if (result) {
          console.log(result.receipt.status);
          if (parseInt(result.receipt.status) == 1)
            alert(account + " General Appearence Score done successfully")
          else
            alert(account + " General Appearence Score not done successfully due to revert")
        } else {
          alert(account + " General Appearence Score failed")
        }
      });
    });
  },

  handleBodyScore: function (score) {
    web3.eth.getAccounts(function (error, accounts) {
      var account = accounts[0];

      App.contracts.vote.deployed().then(function (instance) {
        voteInstance = instance;

        return voteInstance.generalAppearanceScore(score, {
          from: account
        });
      }).then(function (result, err) {
        if (result) {
          console.log(result.receipt.status);
          if (parseInt(result.receipt.status) == 1)
            alert(account + " General Appearence Score done successfully")
          else
            alert(account + " General Appearence Score not done successfully due to revert")
        } else {
          alert(account + " General Appearence Score failed")
        }
      });
    });
  },
  handleForqScore: function (score) {
    web3.eth.getAccounts(function (error, accounts) {
      var account = accounts[0];

      App.contracts.vote.deployed().then(function (instance) {
        voteInstance = instance;

        return voteInstance.generalAppearanceScore(score, {
          from: account
        });
      }).then(function (result, err) {
        if (result) {
          console.log(result.receipt.status);
          if (parseInt(result.receipt.status) == 1)
            alert(account + " General Appearence Score done successfully")
          else
            alert(account + " General Appearence Score not done successfully due to revert")
        } else {
          alert(account + " General Appearence Score failed")
        }
      });
    });
  },

  handleCoatScore: function (score) {
    web3.eth.getAccounts(function (error, accounts) {
      var account = accounts[0];

      App.contracts.vote.deployed().then(function (instance) {
        voteInstance = instance;

        return voteInstance.generalAppearanceScore(score, {
          from: account
        });
      }).then(function (result, err) {
        if (result) {
          console.log(result.receipt.status);
          if (parseInt(result.receipt.status) == 1)
            alert(account + " General Appearence Score done successfully")
          else
            alert(account + " General Appearence Score not done successfully due to revert")
        } else {
          alert(account + " General Appearence Score failed")
        }
      });
    });
  },

  handleHindqScore: function (score) {
    web3.eth.getAccounts(function (error, accounts) {
      var account = accounts[0];

      App.contracts.vote.deployed().then(function (instance) {
        voteInstance = instance;

        return voteInstance.generalAppearanceScore(score, {
          from: account
        });
      }).then(function (result, err) {
        if (result) {
          console.log(result.receipt.status);
          if (parseInt(result.receipt.status) == 1)
            alert(account + " General Appearence Score done successfully")
          else
            alert(account + " General Appearence Score not done successfully due to revert")
        } else {
          alert(account + " General Appearence Score failed")
        }
      });
    });
  },

  // handleChangeGroup: function (group) {
  //   console.log(group);
  // },

  // handleChangeDog : function (dog) {
  //   console.log("change dog not yet implemented");
  // }
};

$(function () {
  $(window).on('load', function () {
    App.init();
  });
});