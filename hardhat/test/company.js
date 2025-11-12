const { expect } = require("chai");

describe("CompanyRegistry", function () {
  it("should register a company", async function () {
    const [owner] = await ethers.getSigners();

    const CompanyRegistry = await ethers.getContractFactory("CompanyRegistry");
    const registry = await CompanyRegistry.deploy(); // Ethers v6: no deployed()

    const tx = await registry.registerCompany("Acme Inc.");
    await tx.wait();

    const company = await registry.getCompany(0);

    expect(company.admin).to.equal(owner.address);
    expect(company.name).to.equal("Acme Inc.");
    expect(company.exists).to.equal(true);
  });
});
