// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PharmaChain
 * @dev Decentralized Medicine Authentication and Provenance Verification Smart Contract
 */
contract PharmaChain {
    // Enum representing current lifecycle verification status
    enum MedicineStatus {
        GENUINE,    // 0
        EXPIRED,    // 1
        SUSPICIOUS, // 2
        RECALLED    // 3
    }

    // Medicine structural record stored immutably on the ledger
    struct Medicine {
        string medicineId;
        string name;
        string batchNumber;
        string manufacturer;
        uint256 manufacturingDate; // UNIX epoch timestamp
        uint256 expiryDate;        // UNIX epoch timestamp
        MedicineStatus status;
        bool exists;
        address registeredBy;
        uint256 registeredAtBlock;
        uint256 registeredTimestamp;
    }

    // Contract administrator / deployer
    address public owner;

    // Authorized manufacturer address registry
    mapping(address => bool) public authorizedManufacturers;

    // Primary key mapping: medicineId => Medicine
    mapping(string => Medicine) private medicines;

    // Array of all registered medicine IDs for transparency and auditing
    string[] private medicineIds;

    // Events emitted for off-chain indexing and audit logging
    event MedicineRegistered(
        string indexed medicineId,
        string name,
        string batchNumber,
        string manufacturer,
        address indexed registeredBy,
        uint256 timestamp
    );

    event MedicineStatusUpdated(
        string indexed medicineId,
        MedicineStatus oldStatus,
        MedicineStatus newStatus,
        address indexed updatedBy,
        uint256 timestamp
    );

    event ManufacturerAuthorized(address indexed manufacturer);
    event ManufacturerRevoked(address indexed manufacturer);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "PharmaChain: Caller is not contract owner");
        _;
    }

    modifier onlyAuthorized() {
        require(
            authorizedManufacturers[msg.sender] || msg.sender == owner,
            "PharmaChain: Caller is not an authorized manufacturer or owner"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedManufacturers[msg.sender] = true;
        emit ManufacturerAuthorized(msg.sender);
    }

    /**
     * @dev Authorize a manufacturer wallet address to register medicines
     * @param _manufacturer Address to authorize
     */
    function authorizeManufacturer(address _manufacturer) external onlyOwner {
        require(_manufacturer != address(0), "PharmaChain: Invalid address");
        require(!authorizedManufacturers[_manufacturer], "PharmaChain: Already authorized");
        authorizedManufacturers[_manufacturer] = true;
        emit ManufacturerAuthorized(_manufacturer);
    }

    /**
     * @dev Revoke a manufacturer's registration authorization
     * @param _manufacturer Address to revoke
     */
    function revokeManufacturer(address _manufacturer) external onlyOwner {
        require(authorizedManufacturers[_manufacturer], "PharmaChain: Not authorized");
        require(_manufacturer != owner, "PharmaChain: Cannot revoke owner");
        authorizedManufacturers[_manufacturer] = false;
        emit ManufacturerRevoked(_manufacturer);
    }

    /**
     * @dev Register a new medicine unit on the blockchain ledger
     * @param _medicineId Unique identifier (e.g. MED-2026-A8F92K)
     * @param _name Commercial drug name
     * @param _batchNumber Production batch / lot code
     * @param _manufacturer Name of the manufacturing company
     * @param _manufacturingDate UNIX epoch timestamp of manufacturing
     * @param _expiryDate UNIX epoch timestamp of product expiry
     */
    function registerMedicine(
        string calldata _medicineId,
        string calldata _name,
        string calldata _batchNumber,
        string calldata _manufacturer,
        uint256 _manufacturingDate,
        uint256 _expiryDate
    ) external onlyAuthorized {
        require(bytes(_medicineId).length > 0, "PharmaChain: Medicine ID cannot be empty");
        require(bytes(_name).length > 0, "PharmaChain: Name cannot be empty");
        require(bytes(_batchNumber).length > 0, "PharmaChain: Batch number cannot be empty");
        require(bytes(_manufacturer).length > 0, "PharmaChain: Manufacturer cannot be empty");
        require(_expiryDate > _manufacturingDate, "PharmaChain: Expiry date must be after manufacturing date");
        require(!medicines[_medicineId].exists, "PharmaChain: Medicine ID already registered");

        MedicineStatus initialStatus = MedicineStatus.GENUINE;
        if (block.timestamp >= _expiryDate) {
            initialStatus = MedicineStatus.EXPIRED;
        }

        medicines[_medicineId] = Medicine({
            medicineId: _medicineId,
            name: _name,
            batchNumber: _batchNumber,
            manufacturer: _manufacturer,
            manufacturingDate: _manufacturingDate,
            expiryDate: _expiryDate,
            status: initialStatus,
            exists: true,
            registeredBy: msg.sender,
            registeredAtBlock: block.number,
            registeredTimestamp: block.timestamp
        });

        medicineIds.push(_medicineId);

        emit MedicineRegistered(
            _medicineId,
            _name,
            _batchNumber,
            _manufacturer,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @dev Retrieve full immutable details of a registered medicine
     * @param _medicineId Unique medicine identifier
     */
    function getMedicine(string calldata _medicineId)
        external
        view
        returns (
            string memory medicineId,
            string memory name,
            string memory batchNumber,
            string memory manufacturer,
            uint256 manufacturingDate,
            uint256 expiryDate,
            MedicineStatus status,
            bool exists,
            address registeredBy,
            uint256 registeredAtBlock,
            uint256 registeredTimestamp
        )
    {
        Medicine storage med = medicines[_medicineId];
        require(med.exists, "PharmaChain: Medicine not found");

        // Dynamically reflect expiration if time has elapsed
        MedicineStatus currentStatus = med.status;
        if (block.timestamp >= med.expiryDate && currentStatus == MedicineStatus.GENUINE) {
            currentStatus = MedicineStatus.EXPIRED;
        }

        return (
            med.medicineId,
            med.name,
            med.batchNumber,
            med.manufacturer,
            med.manufacturingDate,
            med.expiryDate,
            currentStatus,
            med.exists,
            med.registeredBy,
            med.registeredAtBlock,
            med.registeredTimestamp
        );
    }

    /**
     * @dev Check whether a medicine ID is registered on the ledger
     * @param _medicineId Unique medicine identifier
     */
    function medicineExists(string calldata _medicineId) external view returns (bool) {
        return medicines[_medicineId].exists;
    }

    /**
     * @dev Update medicine status (e.g. mark as SUSPICIOUS, RECALLED, or EXPIRED)
     * @param _medicineId Unique identifier
     * @param _newStatus New status code
     */
    function updateMedicineStatus(string calldata _medicineId, MedicineStatus _newStatus)
        external
        onlyAuthorized
    {
        Medicine storage med = medicines[_medicineId];
        require(med.exists, "PharmaChain: Medicine does not exist");

        MedicineStatus oldStatus = med.status;
        med.status = _newStatus;

        emit MedicineStatusUpdated(_medicineId, oldStatus, _newStatus, msg.sender, block.timestamp);
    }

    /**
     * @dev Get total count of registered medicines
     */
    function getTotalMedicinesCount() external view returns (uint256) {
        return medicineIds.length;
    }

    /**
     * @dev Get paginated list of medicine IDs
     * @param _offset Starting index
     * @param _limit Maximum number of IDs to return
     */
    function getMedicineIds(uint256 _offset, uint256 _limit)
        external
        view
        returns (string[] memory)
    {
        uint256 total = medicineIds.length;
        if (_offset >= total) {
            return new string[](0);
        }

        uint256 end = _offset + _limit;
        if (end > total) {
            end = total;
        }

        uint256 size = end - _offset;
        string[] memory result = new string[](size);
        for (uint256 i = 0; i < size; i++) {
            result[i] = medicineIds[_offset + i];
        }
        return result;
    }

    /**
     * @dev Get all medicine IDs (convenience method for local explorers)
     */
    function getAllMedicineIds() external view returns (string[] memory) {
        return medicineIds;
    }

    /**
     * @dev Transfer contract ownership
     * @param _newOwner New owner wallet address
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "PharmaChain: New owner is the zero address");
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
        authorizedManufacturers[_newOwner] = true;
    }
}
