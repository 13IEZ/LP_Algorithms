//step 1
  class Shipment {
    ShipmentID: number;
    static ShipmentIDCounter: number = 0;
    Weight: number;
    FromAddress: string;
    FromZipCode: string;
    ToAddress: string;
    ToZipCode: string;
    constructor(Weight: number, FromAddress: string, FromZipCode: string, ToAddress: string, ToZipCode: string) {
      this.ShipmentID = Shipment.ShipmentIDCounter + 1;
      ++Shipment.ShipmentIDCounter;
      this.Weight = Weight;
      this.FromAddress = FromAddress;
      this.FromZipCode = FromZipCode;
      this.ToAddress = ToAddress;
      this.ToZipCode = ToZipCode;
    }

    calculateShipmentCost(): number {
      const zipCode: string = this.FromZipCode.split('')[0];

      if(this.Weight <= 15) {
        if(['1','2','3'].includes(zipCode)) return this.Weight * 0.39;
        else if(['4','5','6'].includes(zipCode)) return this.Weight * 0.42;
        else if(['7','8','9'].includes(zipCode)) return this.Weight * 0.51;
        else return this.Weight * 0.39;
      } else if(this.Weight > 15 && this.Weight <= 160) {
        if(['1','2','3'].includes(zipCode)) return this.Weight * 0.25;
        else if(['4','5','6'].includes(zipCode)) return this.Weight * 0.20;
        else if(['7','8','9'].includes(zipCode)) return this.Weight * 0.19;
        else return this.Weight * 0.25;
      } else {
        if(['1','2','3'].includes(zipCode)) return this.Weight * 0.25 + 10;
        else if(['4','5','6'].includes(zipCode)) return this.Weight * 0.20;
        else if(['7','8','9'].includes(zipCode)) return this.Weight * 0.19 + this.Weight * 0.02;
        else return this.Weight * this.Weight * 0.25 + 10;
      }
    }
    ship(): string {
      const cost: number = this.calculateShipmentCost();
      return `Shipment ID: ${this.ShipmentID}, From: ${this.FromAddress}, To: ${this.ToAddress}, Cost: ${cost.toFixed(2)}`;
    }

    getShipmentID(): number {
      return this.ShipmentID;
    }

    getInstance(): Shipment {
      return this;
    }
  }

class Client {
  shipment: Shipment;
  constructor(shipment: Shipment) {
    this.shipment = shipment;
  }
}

// step 2
class Shipper {
  shipment: Shipment;
  cost: number;
  constructor(shipment: Shipment, cost: number) {
    this.shipment = shipment;
    this.cost = cost;
  }

  getCost(): number {
    return this.shipment.Weight * this.cost;
  }

  getInstance(): Shipper {
    return this;
  }
}

class AirEastShipper extends Shipper {
  static cost = 0.39;
  constructor(shipment: Shipment) {
    super(shipment, AirEastShipper.cost);
  }
}

class ChicagoSprintShipper extends Shipper {
  static cost = 0.42;
  constructor(shipment: Shipment) {
    super(shipment, ChicagoSprintShipper.cost);
  }
}

class PacificParcelShipper extends Shipper {
  static cost = 0.51;
  constructor(shipment: Shipment) {
    super(shipment, PacificParcelShipper.cost);
  }
}

// step 3
class Letter extends Shipment {
  constructor(Weight: number, FromAddress: string, FromZipCode: string, ToAddress: string, ToZipCode: string) {
    Weight <= 15
      ? super(Weight, FromAddress, FromZipCode, ToAddress, ToZipCode)
      : new Error("Letter cannot be heavier than 15 ounces");
  }
}

class Package extends Shipment {
  constructor(Weight: number, FromAddress: string, FromZipCode: string, ToAddress: string, ToZipCode: string) {
    Weight > 15 && Weight <= 160
      ? super(Weight, FromAddress, FromZipCode, ToAddress, ToZipCode)
      : new Error("Package cannot be heavier than 160 ounces");
  }
}

class Oversize extends Shipment {
  constructor(Weight: number, FromAddress: string, FromZipCode: string, ToAddress: string, ToZipCode: string) {
    Weight > 160
      ? super(Weight, FromAddress, FromZipCode, ToAddress, ToZipCode)
      : new Error("Oversize cannot be lighter than 160 ounces");
  }
}

// step 4
class ShipmentDecorator implements Shipment {
  FromAddress: string;
  FromZipCode: string;
  ShipmentID: number;
  ToAddress: string;
  ToZipCode: string;
  Weight: number;
  shipment: Shipment;
  constructor(shipment: Shipment) {
    this.shipment = shipment;
    this.FromAddress = shipment.FromAddress;
    this.FromZipCode = shipment.FromZipCode;
    this.ShipmentID = shipment.ShipmentID;
    this.ToAddress = shipment.ToAddress;
    this.ToZipCode = shipment.ToZipCode;
    this.Weight = shipment.Weight;
  }

  ship(): string {
    return this.shipment.ship();
  }

  getShipmentID(): number {
    return this.shipment.getShipmentID();
  }

  getInstance(): Shipment {
    return this.shipment.getInstance();
  }

  calculateShipmentCost(): number {
    return this.shipment.calculateShipmentCost();
  }
}

class FragileDecorator extends ShipmentDecorator {
  constructor(shipment: Shipment) {
    super(shipment);
  }

  ship(): string {
    return `${super.ship()} \n**MARK FRAGILE**`;
  }
}
class NotAddressedDecorator extends ShipmentDecorator {
  constructor(shipment: Shipment) {
    super(shipment);
  }

  ship(): string {
    return `${super.ship()} \n**MARK DO NOT LEAVE IF ADDRESS NOT AT HOME**`;
  }
}

class ReturnReceiptDecorator extends ShipmentDecorator {
  constructor(shipment: Shipment) {
    super(shipment);
  }

  ship(): string {
    return `${super.ship()} \n**MARK RETURN RECEIPT**`;
  }
}

let testShipment = new Shipment(10, '123 Main St', '12345', '456 Main St', '45678');
testShipment = new FragileDecorator(testShipment);
testShipment = new NotAddressedDecorator(testShipment);
testShipment = new ReturnReceiptDecorator(testShipment);
console.log(testShipment.ship());