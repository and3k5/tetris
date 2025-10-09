import { sortBy } from ".";

describe("sortBy", function () {
    it("can sort a simple array ascending", function () {
        const data = [5, 1, 4, 2, 3];

        const newData = sortBy<number>((s) => s, false).execute(data);

        expect(newData[0]).toBe(1);
        expect(newData[1]).toBe(2);
        expect(newData[2]).toBe(3);
        expect(newData[3]).toBe(4);
        expect(newData[4]).toBe(5);
    });

    it("can sort a simple array descending", function () {
        const data = [5, 1, 4, 2, 3];

        const newData = sortBy<number>((s) => s, true).execute(data);

        expect(newData[0]).toBe(5);
        expect(newData[1]).toBe(4);
        expect(newData[2]).toBe(3);
        expect(newData[3]).toBe(2);
        expect(newData[4]).toBe(1);
    });

    it("can sort a object array ascending", function () {
        const data = [
            { a: 1, b: 1, c: 1 },
            { a: 1, b: 1, c: 2 },
            { a: 1, b: 1, c: 3 },
            { a: 1, b: 1, c: 4 },
            { a: 1, b: 1, c: 5 },
            { a: 1, b: 2, c: 1 },
            { a: 1, b: 2, c: 2 },
            { a: 1, b: 2, c: 3 },
            { a: 1, b: 2, c: 4 },
            { a: 1, b: 2, c: 5 },
            { a: 2, b: 1, c: 1 },
            { a: 2, b: 1, c: 2 },
            { a: 2, b: 1, c: 3 },
            { a: 2, b: 1, c: 4 },
            { a: 2, b: 1, c: 5 },
        ];

        const scrambledData = data.concat().sort(() => Math.random() * 100 - 50);

        expect(JSON.stringify(scrambledData)).not.toBe(JSON.stringify(data));

        const newData = sortBy<(typeof data)[number]>((s) => s.a)
            .thenBy((s) => s.b)
            .thenBy((s) => s.c)
            .execute(scrambledData);

        for (const i in data) {
            const expected = data[i];
            const actual = newData[i];
            expect(actual.a).toBe(expected.a);
            expect(actual.b).toBe(expected.b);
            expect(actual.c).toBe(expected.c);
        }
    });
});
