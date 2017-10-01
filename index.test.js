import { processTemplate } from './index.js';

const TEMPLATE = "Author {% author %} wrote the following books: {# for book in books #}{% book.title %} ({# for tag in book.tags #}{% tag %}, {# end #}), {# end #}";
const DATA = {
  author: "Ernest Hemingway",
  books: [
    {
        title: "A Farewell to Arms",
        tags: ["Novel", "World War I"]
    },
    {
        title: "For Whom the Bell Tolls",
        tags: ["Novel", "Spanish Civil War"]
    },
    {
        title: "The Old Man and the Sea",
        tags: ["Novel", "Cuba", "Nobel Prize"]
    }
  ]
};

const EXPECTED_RESULT = "Author Ernest Hemingway wrote the following books: A Farewell to Arms (Novel, World War I,), For Whom the Bell Tolls (Novel, Spanish Civil War,), The Old Man and the Sea (Novel, Cuba, Nobel Prize,),";

describe('processTemplate', () => {
    test('It should fill a template with the correct data and output it as a string', () => {
        const result = processTemplate(TEMPLATE, DATA);

        expect(result).toBe(EXPECTED_RESULT);
    });
});

