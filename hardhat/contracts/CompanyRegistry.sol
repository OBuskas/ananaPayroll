// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CompanyRegistry {
    struct Company {
        address admin;
        string name;
        bool exists;
    }

    uint256 public nextCompanyId;
    mapping(uint256 => Company) public companies;

    event CompanyRegistered(
        uint256 indexed companyId,
        address indexed admin,
        string name
    );

    function registerCompany(string calldata name)
        external
        returns (uint256)
    {
        uint256 companyId = nextCompanyId++;

        companies[companyId] = Company({
            admin: msg.sender,
            name: name,
            exists: true
        });

        emit CompanyRegistered(companyId, msg.sender, name);
        return companyId;
    }

    function getCompany(uint256 companyId)
        external
        view
        returns (Company memory)
    {
        require(companies[companyId].exists, "Company does not exist");
        return companies[companyId];
    }

    function isCompanyAdmin(uint256 companyId, address user)
        external
        view
        returns (bool)
    {
        return companies[companyId].admin == user;
    }
}
