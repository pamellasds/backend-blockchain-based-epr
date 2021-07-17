pragma solidity ^0.5.1;
pragma experimental ABIEncoderV2;

contract controleRegistro {

    address public proprietario;
    
    mapping (uint => mapping(uint => bool)) private Posse;
    mapping (uint => mapping(uint => bool)) private Acesso;
    mapping (uint => string) private arquivoHash;
    
    constructor() public { proprietario = msg.sender; }
    
    function incluirPosse(uint _idRegister, uint _idPaciente, string memory _arquivoHash) public returns (string memory) {
        require(msg.sender == proprietario, "ERRO: Somente o proprietário pode executar essa função!");
        Posse[_idPaciente][_idRegister] = true;
        arquivoHash[_idRegister] = _arquivoHash;
        return "SUCESSO: posse incluida!";
    }
    
    function incluirAcesso(uint _idRegister, uint _idUser) public returns (string memory) {
        require(msg.sender == proprietario, "ERRO: Somente o proprietário pode executar essa função!");
        Acesso[_idRegister][_idUser] = true;
        return "SUCESSO: acesso incluido!";
    }
    
    function recuperarRegistro(uint _idRegister, uint _idUser) public returns (string memory) {
        require(msg.sender == proprietario, "ERRO: Somente o proprietário pode executar essa função!");
        if(Posse[_idUser][_idRegister]==true || Acesso[_idRegister][_idUser]==true ) return arquivoHash[_idRegister];
        else return "ERRO: O usuário não tem acesso a esse laudo!";
    }
    
    
    function checarPosse(uint _idRegister, uint _idUser) public returns (bool) {
        require(msg.sender == proprietario, "ERRO: Somente o proprietário pode executar essa função!");
        return Posse[_idUser][_idRegister];
    }
    

    function checarAcesso(uint _idRegister, uint _idUser) public returns (bool) {
        require(msg.sender == proprietario, "ERRO: Somente o proprietário pode executar essa função!");
        return Acesso[_idRegister][_idUser];
    }
    
    function removeAcesso(uint _idRegister, uint _idUser) public returns (string memory) {
        if (msg.sender != proprietario) return "ERRO: Somente o proprietário pode executar essa função!";
        Acesso[_idRegister][_idUser] = false;
        return "SUCESSO: acesso removido!";
    }
    


    function mudarProprietario(address novoProprietario) public returns (string memory) {
        require(msg.sender == proprietario, "ERRO: Somente o proprietário pode executar essa função!");
        proprietario = novoProprietario;
        return "SUCESSO: Proprietário alterado!";
    }
}
