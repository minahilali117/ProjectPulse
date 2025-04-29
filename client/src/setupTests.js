
// Correct import
import "@testing-library/jest-dom";
import 'web-streams-polyfill';
// Clean up after each test
import { cleanup } from "@testing-library/react";

beforeAll(() => {
    window.scrollTo = jest.fn();
});

afterEach(() => {
    cleanup();
});
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

if (typeof ReadableStream === 'undefined') {
    global.ReadableStream = require('web-streams-polyfill').ReadableStream;
}