class PacketDecoder {
    #packet
    constructor(input) {
        const binary = this.#convertToBinary(input);
        this.#packet = Packet.create(binary);
    }

    #convertToBinary(input) {
        return input.split('').reduce((a, b) => {
            a.push(parseInt(b, 16).toString(2).padStart(4, '0'));
            return a;
        }, []).join('');
    }

    get packet() {
        return this.#packet;
    }
}

class Packet {
    #version
    #type
    #remainder
    #packets
    static #LITERAL_TYPE_ID = 4

    constructor(data) {
        this.#version = parseInt(data.substring(0, 3), 2);
        this.#type = Packet.#decodeType(data);
        this.#remainder = data.substring(6);
        this.#packets = [];
    }

    static #decodeType(data) {
        return parseInt(data.substring(3, 6), 2);
    }

    static create(data) {
        return Packet.#decodeType(data) == Packet.#LITERAL_TYPE_ID ? new LiteralPacket(data) : new OperatorPacket(data);
    }

    isLiteralValue() {
        return this.#type === Packet.#LITERAL_TYPE_ID;
    }

    get packets() {
        return this.#packets;
    }

    set packets(val) {
        this.#packets = val;
    }

    get allPackets() {
        return this.#packets.reduce((a, b) => { a.push[b]; a.push(...b.allPackets); return a; }, [this]);
    }

    get remainder() {
        return this.#remainder;
    }

    set remainder(val) {
        this.#remainder = val;
    }

    get type() {
        return this.#type;
    }

    get version() {
        return this.#version;
    }

    get value() {
        return 0;
    }
}

class LiteralPacket extends Packet {
    #value
    constructor(data) {
        super(data);

        let groups = [];
        // For a literal value packet, we keep grabbing sets of 5 bits 
        // while the starting bit in the next set of 5 is a 1. After that,
        // There should be at least one more set of 5 bits, starting with 
        // a 0. We won't check this though, we'll assume the input is 
        // well-formed according to the rules.
        while (this.remainder.charAt(0) == '1') {
            groups.push(this.remainder.substring(1, 5));
            this.remainder = this.remainder.substring(5);
        }

        groups.push(this.remainder.substring(1, 5));
        this.remainder = this.remainder.substring(5);

        this.#value = parseInt(groups.join(''), 2);
    }

    get value() {
        return this.#value;
    }

    toString() {
        return `${this.value}`;
    }
}

class OperatorPacket extends Packet {
    constructor(data) {
        super(data);
        const lengthType = parseInt(this.remainder.charAt(0), 2);
        this.remainder = this.remainder.substring(1);

        this.packets = [];
        if (lengthType == 0) {
            // Fixed number of bits making up 1 or more sub-packets
            const subPacketTotalLength = parseInt(this.remainder.substring(0, 15), 2);
            this.remainder = this.remainder.substring(15);

            // As long as there are at least 11 characters left in the sub-packet data,
            // create a new packet, then remove that from the subpacket data. 11 seemed to 
            // be the right number, as that is the shortest packet length there can be (a 
            // literal packet has 3 bits for version, 3 bits for type, followed by at least 5
            // more bits for the value). 
            let subPacketData = this.remainder.substring(0, subPacketTotalLength);
            while (subPacketData.length >= 11) {
                let next = Packet.create(subPacketData);
                this.packets.push(next);
                subPacketData = next.remainder; 
            }
            this.remainder = this.remainder.substring(subPacketTotalLength);
        } else {
            // Fixed number of sub-packets in the packet
            const numberOfSubPackets = parseInt(this.remainder.substring(0, 11), 2);
            this.remainder = this.remainder.substring(11);

            // We're going to keep creating packets until we reach the number of sub-packets
            // specified. This assumes the input is well-formed...
            while (this.packets.length < numberOfSubPackets) {
                let next = Packet.create(this.remainder);
                this.packets.push(next)
                this.remainder = next.remainder;
            }
        }
    }

    get value() {
        let val;
        let values = this.packets.map(p => p.value);
        switch (this.type) {
            case 0: // sum
                val = values.sum();
                break;
            case 1: // product
                val = values.multiply()
                break;
            case 2: // minimum
                val = Math.min(...values);
                break;
            case 3: // maximum
                val = Math.max(...values);
                break;
            case 5: // greater than
                val = values[0] > values[1] ? 1 : 0;
                break;
            case 6: // less than
                val = values[0] < values[1] ? 1 : 0;
                break;
            case 7: // equal to
                val = values[0] == values[1] ? 1 : 0;
                break;
            default: // Oh no!
                throw Error(`Invalid operator type id ${this.type}`);
        }

        return val;
    }
}

module.exports = { PacketDecoder }