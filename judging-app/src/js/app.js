App = {
    web3Provider: null,
    contracts: {},
    names: new Array(),
    url: 'http://127.0.0.1:7545',
    chairPerson:null,
    currentAccount:null,
    init: function() {
      // $.getJSON('../proposals.json', function(data) {
      //   var proposalsRow = $('#proposalsRow');
      //   var proposalTemplate = $('#proposalTemplate');
  
      //   for (i = 0; i < data.length; i ++) {
      //     proposalTemplate.find('.panel-title').text(data[i].name);
      //     proposalTemplate.find('img').attr('src', data[i].picture);
      //     proposalTemplate.find('.btn-vote').attr('data-id', data[i].id);
  
      //     proposalsRow.append(proposalTemplate.html());
      //     App.names.push(data[i].name);
      //   }
      // });
      return App.initWeb3();
    },
  
    initWeb3: function() {
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
  
    initContract: function() {
        $.getJSON('DogShow.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var voteArtifact = data;
      App.contracts.vote = TruffleContract(voteArtifact);
  
      // Set the provider for our contract
      App.contracts.vote.setProvider(App.web3Provider);
      
      App.getChairperson();
      return App.bindEvents();
    });
    },
  
    bindEvents: function() {
      // scoring functions
      $(document).on('click', '.gen-app-btn', function(){ var score = $('#enter_score').val(); App.handleGenAppScore(score); });
      $(document).on('click', '.head-btn', function(){ var score = $('#enter_score').val(); App.handleHeadScore(score); });
      $(document).on('click', '.body-btn', function(){ var score = $('#enter_score').val(); App.handleBodyScore(score); });
      $(document).on('click', '.forq-btn', function(){ var score = $('#enter_score').val(); App.handleForqScore(score); });
      $(document).on('click', '.coat-btn', function(){ var score = $('#enter_score').val(); App.handleCoatScore(score); });
      $(document).on('click', '.hindq-btn', function(){ var score = $('#enter_score').val(); App.handleHindqScore(score) });



      // group change functions
      $(document).on('click', '.sporting-group', handleChangeGroup(Sporting));
      $(document).on('click', '.sporting-group', handleChangeGroup(Hound));
      $(document).on('click', '.sporting-group', handleChangeGroup(Working));
      $(document).on('click', '.sporting-group', handleChangeGroup(Terrier));
      $(document).on('click', '.sporting-group', handleChangeGroup(Toy));
      $(document).on('click', '.sporting-group', handleChangeGroup(NonSporting));
      $(document).on('click', '.sporting-group', handleChangeGroup(Herding));

      // dog change functions
      $(document).on('click', '.d1', handleChangeDog(1));
      $(document).on('click', '.d2', handleChangeDog(2));
      $(document).on('click', '.d3', handleChangeDog(3));
      $(document).on('click', '.d4', handleChangeDog(4));
      $(document).on('click', '.d5', handleChangeDog(5));
      $(document).on('click', '.d6', handleChangeDog(6));
      $(document).on('click', '.d7', handleChangeDog(7));
      $(document).on('click', '.d8', handleChangeDog(8));
      $(document).on('click', '.d9', handleChangeDog(9));
      $(document).on('click', '.d10', handleChangeDog(10));
      $(document).on('click', '.d11', handleChangeDog(11));
      $(document).on('click', '.d12', handleChangeDog(12));
      $(document).on('click', '.d13', handleChangeDog(13));
      $(document).on('click', '.d14', handleChangeDog(14));
      $(document).on('click', '.d15', handleChangeDog(15));
      $(document).on('click', '.d16', handleChangeDog(16));
      $(document).on('click', '.d17', handleChangeDog(17));
      $(document).on('click', '.d18', handleChangeDog(18));
      $(document).on('click', '.d19', handleChangeDog(19));
      $(document).on('click', '.d20', handleChangeDog(20));
      $(document).on('click', '.d21', handleChangeDog(21));
      $(document).on('click', '.d22', handleChangeDog(22));
      $(document).on('click', '.d23', handleChangeDog(23));
      $(document).on('click', '.d24', handleChangeDog(24));
      $(document).on('click', '.d25', handleChangeDog(25));
      $(document).on('click', '.d26', handleChangeDog(26));
      $(document).on('click', '.d27', handleChangeDog(27));
      $(document).on('click', '.d28', handleChangeDog(28));
      $(document).on('click', '.d29', handleChangeDog(29));
      $(document).on('click', '.d30', handleChangeDog(30));
      $(document).on('click', '.d31', handleChangeDog(31));
      $(document).on('click', '.d32', handleChangeDog(32));
      $(document).on('click', '.d33', handleChangeDog(33));
      $(document).on('click', '.d34', handleChangeDog(34));
      $(document).on('click', '.d35', handleChangeDog(35));


      // phase change function
      $(document).on('click', '.phase-btn', App.handlePhaseChange);

      // win calc function
      $(document).on('click', '.winner-btn', App.handleWinner);

      // register function
      $(document).on('click', '.register-btn', function(){ var ad = $('#enter_address').val(); App.handleRegister(ad); });
    },
  
    populateAddress : function(){
      new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
        jQuery.each(accounts,function(i){
          if(web3.eth.coinbase != accounts[i]){
            var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
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
        if(App.chairPerson != App.currentAccount){
          jQuery('#address_div').css('display','none');
          jQuery('#register_div').css('display','none');
        }else{
          jQuery('#address_div').css('display','block');
          jQuery('#register_div').css('display','block');
        }
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
  
    // handleVote: function(event) {
    //   event.preventDefault();
    //   var proposalId = parseInt($(event.target).data('id'));
    //   var voteInstance;
  
    //   web3.eth.getAccounts(function(error, accounts) {
    //     var account = accounts[0];
  
    //     App.contracts.vote.deployed().then(function(instance) {
    //       voteInstance = instance;
  
    //       return voteInstance.vote(proposalId, {from: account});
    //     }).then(function(result, err){
    //           if(result){
    //               console.log(result.receipt.status);
    //               if(parseInt(result.receipt.status) == 1)
    //               alert(account + " voting done successfully")
    //               else
    //               alert(account + " voting not done successfully due to revert")
    //           } else {
    //               alert(account + " voting failed")
    //           }   
    //       });
    //   });
    // },
  
    handleWinner : function() {
      console.log("To get winner");
      var voteInstance;
      App.contracts.vote.deployed().then(function(instance) {
        voteInstance = instance;
        return voteInstance.reqWinner();
      }).then(function(res){
      console.log(res);
        alert(App.names[res] + "  is the winner ! :)");
      }).catch(function(err){
        console.log(err.message);
      })
    },


    handleGenAppScore : function(event) {
      event.preventDefault();
      // var proposalId = parseInt($(event.target).data('id'));
      console.log(event.target);
    },

    // handleHeadScore :















  };

  $(function() {
    $(window).on('load', function() {
      App.init();
    });
  }); 
  