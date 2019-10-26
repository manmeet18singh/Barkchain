pragma solidity ^0.5.2;

contract DogShow {

    struct Dog {
        uint8 dogName;
        uint8 dogType;
        uint8 genApScr;
        uint8 hScr;
        uint8 bScr;
        uint8 fScr;
        uint8 cScr;
        uint8 hqScr;
    }

    struct Judge {
        uint8 weight;
        uint8 dogVotedFor;
        bool voted_genApScr;
        bool voted_hScr;
        bool voted_bScr;
        bool voted_fScr;
        bool voted_cScr;
        bool voted_hqScr;
    }

    address chairperson;
    mapping(address => Judge) judges;
    Dog[] dogs;
    uint8 public currentDog;
    uint8 public currentDogGroup;

    //Judging Phases
    enum Phase {Init, Regs, Vote, Done}
    Phase public state = Phase.Done;

    //Dog Groups
    enum Group {Sporting, Hound, Working, Terrier, Toy, NonSporting, Herding}
    Group public dogGroup = Group.Sporting;

    //Modifiers
    modifier validPhase(Phase neededPhase) {
        require(state == neededPhase, "Not in the right phase");
       _;
    }

    modifier onlyChair() {
         require(msg.sender == chairperson, "Need to be chairman");
         _;
     }

    modifier validGroup(Group neededGroup) {
        require(dogGroup == neededGroup, "Change dog group");
        _;
    }

    // modifier checkPointVal(uint val) {
    //     require(val <= 10, "Cannot award more than 10 points");
    //     _;
    // }

    constructor (uint8 numDogs) public  {
        chairperson = msg.sender;
        judges[chairperson].weight = 2;
        dogs.length = numDogs;
        state = Phase.Regs;
        dogGroup = Group.Sporting;
        currentDog = 0;
        currentDogGroup = dogs[currentDog].dogType;

        //set dog types
        for (uint8 dog = 0; dog < dogs.length; dog++){
            dogs[dog].dogType = dog%7;
        }
    }

    //Change Judging State
     function changeState(Phase x) public onlyChair{
        require (x > state, "Cannot revert states");
        state = x;
     }

     //Change Group
     function changeGroup(Group x) public onlyChair{
         dogGroup = x;
     }

     //Change Current Dog Being Judged
     function changeDog(uint8 dog) public onlyChair{
         require (dog < dogs.length, "dog selected must be in the list");
         currentDog = dog;
         currentDogGroup = dogs[dog].dogType;
     }

    function register(address judge) public validPhase(Phase.Regs) onlyChair {
        require (!judges[judge].voted_genApScr, "Cannot have already voted");
        require (!judges[judge].voted_hScr, "Cannot have already voted");
        require (!judges[judge].voted_bScr, "Cannot have already voted");
        require (!judges[judge].voted_fScr, "Cannot have already voted");
        require (!judges[judge].voted_cScr, "Cannot have already voted");
        require (!judges[judge].voted_hqScr, "Cannot have already voted");

        judges[judge].weight = 1;
        judges[judge].voted_genApScr = false;
        judges[judge].voted_hScr = false;
        judges[judge].voted_bScr = false;
        judges[judge].voted_fScr = false;
        judges[judge].voted_cScr = false;
        judges[judge].voted_hqScr = false;
    }

    // Select the dog that is being scored
    function getDogType(uint8 dog) private returns (Group){
        if(dogs[dog].dogType == 0){
            return Group.Sporting;
        }
        if(dogs[dog].dogType == 1){
            return Group.Hound;
        }
        if(dogs[dog].dogType == 2){
            return Group.Working;
        }
        if(dogs[dog].dogType == 3){
            return Group.Terrier;
        }
        if(dogs[dog].dogType == 4){
            return Group.Toy;
        }
        if(dogs[dog].dogType == 5){
            return Group.NonSporting;
        }
        if(dogs[dog].dogType == 6){
            return Group.Herding;
        }
    }

    function generalAppearanceScore(uint8 scr) public validPhase(Phase.Vote) validGroup(getDogType(currentDog)) {
        Judge memory sender = judges[msg.sender];
        require (!sender.voted_genApScr, "Cannot have already voted");
        require (currentDog < dogs.length, "Invalid Dog");

        dogs[currentDog].genApScr += (scr + sender.weight);
        sender.voted_genApScr = true;
        sender.dogVotedFor = currentDog;
    }

    function headScore(uint8 scr) public validPhase(Phase.Vote) validGroup(getDogType(currentDog)){
        Judge memory sender = judges[msg.sender];
        require (!sender.voted_hScr, "Cannot have already voted");
        require (currentDog < dogs.length, "Invalid Dog");

        dogs[currentDog].hScr += (scr + sender.weight);
        sender.voted_hScr = true;
    }

    function bodyScore(uint8 scr) public validPhase(Phase.Vote) validGroup(getDogType(currentDog)){
        Judge memory sender = judges[msg.sender];
        require (!sender.voted_bScr, "Cannot have already voted");
        require (currentDog < dogs.length, "Invalid Dog");

        dogs[currentDog].bScr += (scr + sender.weight);
        sender.voted_bScr = true;
    }

    function forequarterScore(uint8 scr) public validPhase(Phase.Vote) validGroup(getDogType(currentDog)){
        Judge memory sender = judges[msg.sender];
        require (!sender.voted_fScr, "Cannot have already voted");
        require (currentDog < dogs.length, "Invalid Dog");

        dogs[currentDog].fScr += (scr + sender.weight);
        sender.voted_fScr = true;
    }

    function coatScore(uint8 scr) public validPhase(Phase.Vote) validGroup(getDogType(currentDog)) {
        Judge memory sender = judges[msg.sender];
        require (!sender.voted_cScr, "Cannot have already voted");
        require (currentDog < dogs.length, "Invalid Dog");

        dogs[currentDog].cScr += (scr + sender.weight);
        sender.voted_cScr = true;
    }

    function hindquarterScore(uint8 scr) public validPhase(Phase.Vote) validGroup(getDogType(currentDog)) {
        Judge memory sender = judges[msg.sender];
        require (!sender.voted_hqScr, "Cannot have already voted");
        require (currentDog < dogs.length, "Invalid Dog");
        dogs[currentDog].hqScr += (scr + sender.weight);
        sender.voted_hqScr = true;
    }

    function collectWinner() public onlyChair validPhase(Phase.Done) view returns (uint8 winningDog) {
        uint256 winningVoteCount = 0;
        uint256 totScr = 0;
        for (uint8 dog = 0; dog < dogs.length; dog++) {
            totScr = dogs[dog].hScr + dogs[dog].bScr + dogs[dog].fScr + dogs[dog].cScr + dogs[dog].hqScr;
            if (totScr > winningVoteCount) {
                winningVoteCount = totScr;
                winningDog = dog;
            }
        }
      assert(winningVoteCount>=1);
    }
}