const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PharmaChain Smart Contract Tests", function () {
  let pharmaChain;
  let owner;
  let manufacturer;
  let customer;

  const sampleMedicine = {
    id: "MED-2026-A8F92K",
    name: "Amoxicillin 500mg",
    batch: "AMX-BATCH-001",
    mfrName: "Pfizer Global Manufacturing",
    mfgDate: Math.floor(Date.now() / 1000) - 86400 * 30, // 30 days ago
    expDate: Math.floor(Date.now() / 1000) + 86400 * 365  // 1 year in future
  };

  beforeEach(async function () {
    [owner, manufacturer, customer] = await ethers.getSigners();
    const PharmaChainFactory = await ethers.getContractFactory("PharmaChain");
    pharmaChain = await PharmaChainFactory.deploy();
    await pharmaChain.waitForDeployment();
  });

  describe("Deployment & Authorization", function () {
    it("should set deployer as contract owner", async function () {
      expect(await pharmaChain.owner()).to.equal(owner.address);
    });

    it("should authorize owner as manufacturer by default", async function () {
      expect(await pharmaChain.authorizedManufacturers(owner.address)).to.be.true;
    });

    it("should allow owner to authorize a new manufacturer", async function () {
      await expect(pharmaChain.authorizeManufacturer(manufacturer.address))
        .to.emit(pharmaChain, "ManufacturerAuthorized")
        .withArgs(manufacturer.address);

      expect(await pharmaChain.authorizedManufacturers(manufacturer.address)).to.be.true;
    });

    it("should prevent non-owner from authorizing manufacturers", async function () {
      await expect(
        pharmaChain.connect(customer).authorizeManufacturer(customer.address)
      ).to.be.revertedWith("PharmaChain: Caller is not contract owner");
    });
  });

  describe("Medicine Registration", function () {
    beforeEach(async function () {
      await pharmaChain.authorizeManufacturer(manufacturer.address);
    });

    it("should allow authorized manufacturer to register a medicine", async function () {
      await expect(
        pharmaChain.connect(manufacturer).registerMedicine(
          sampleMedicine.id,
          sampleMedicine.name,
          sampleMedicine.batch,
          sampleMedicine.mfrName,
          sampleMedicine.mfgDate,
          sampleMedicine.expDate
        )
      )
        .to.emit(pharmaChain, "MedicineRegistered")
        .withArgs(
          sampleMedicine.id,
          sampleMedicine.name,
          sampleMedicine.batch,
          sampleMedicine.mfrName,
          manufacturer.address,
          (val) => val > 0
        );

      expect(await pharmaChain.medicineExists(sampleMedicine.id)).to.be.true;
      expect(await pharmaChain.getTotalMedicinesCount()).to.equal(1);
    });

    it("should reject registration from unauthorized user", async function () {
      await expect(
        pharmaChain.connect(customer).registerMedicine(
          sampleMedicine.id,
          sampleMedicine.name,
          sampleMedicine.batch,
          sampleMedicine.mfrName,
          sampleMedicine.mfgDate,
          sampleMedicine.expDate
        )
      ).to.be.revertedWith("PharmaChain: Caller is not an authorized manufacturer or owner");
    });

    it("should reject duplicate medicine IDs", async function () {
      await pharmaChain.connect(manufacturer).registerMedicine(
        sampleMedicine.id,
        sampleMedicine.name,
        sampleMedicine.batch,
        sampleMedicine.mfrName,
        sampleMedicine.mfgDate,
        sampleMedicine.expDate
      );

      await expect(
        pharmaChain.connect(manufacturer).registerMedicine(
          sampleMedicine.id,
          sampleMedicine.name,
          sampleMedicine.batch,
          sampleMedicine.mfrName,
          sampleMedicine.mfgDate,
          sampleMedicine.expDate
        )
      ).to.be.revertedWith("PharmaChain: Medicine ID already registered");
    });

    it("should reject registration if expiry date is before manufacturing date", async function () {
      await expect(
        pharmaChain.connect(manufacturer).registerMedicine(
          "MED-INVALID-DATES",
          sampleMedicine.name,
          sampleMedicine.batch,
          sampleMedicine.mfrName,
          sampleMedicine.expDate, // inverted
          sampleMedicine.mfgDate
        )
      ).to.be.revertedWith("PharmaChain: Expiry date must be after manufacturing date");
    });
  });

  describe("Medicine Retrieval & Status Update", function () {
    beforeEach(async function () {
      await pharmaChain.authorizeManufacturer(manufacturer.address);
      await pharmaChain.connect(manufacturer).registerMedicine(
        sampleMedicine.id,
        sampleMedicine.name,
        sampleMedicine.batch,
        sampleMedicine.mfrName,
        sampleMedicine.mfgDate,
        sampleMedicine.expDate
      );
    });

    it("should retrieve full medicine record accurately", async function () {
      const med = await pharmaChain.getMedicine(sampleMedicine.id);
      expect(med.medicineId).to.equal(sampleMedicine.id);
      expect(med.name).to.equal(sampleMedicine.name);
      expect(med.batchNumber).to.equal(sampleMedicine.batch);
      expect(med.manufacturer).to.equal(sampleMedicine.mfrName);
      expect(med.status).to.equal(0); // GENUINE
      expect(med.exists).to.be.true;
      expect(med.registeredBy).to.equal(manufacturer.address);
    });

    it("should update medicine status", async function () {
      // 2 = SUSPICIOUS
      await expect(
        pharmaChain.connect(manufacturer).updateMedicineStatus(sampleMedicine.id, 2)
      )
        .to.emit(pharmaChain, "MedicineStatusUpdated")
        .withArgs(sampleMedicine.id, 0, 2, manufacturer.address, (val) => val > 0);

      const med = await pharmaChain.getMedicine(sampleMedicine.id);
      expect(med.status).to.equal(2);
    });

    it("should fail retrieval for nonexistent medicine", async function () {
      await expect(
        pharmaChain.getMedicine("MED-DOES-NOT-EXIST")
      ).to.be.revertedWith("PharmaChain: Medicine not found");
    });
  });
});
