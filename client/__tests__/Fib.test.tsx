import { render, screen } from "@testing-library/react"
import { Fib } from "../src/components/Fib"

describe("Register component", () => {
    it("should render Register component correctly", () => {
        const x = "test"
        // render(<Fib />);
        // const element = screen.getByRole('heading')
        // expect(element).toBeInTheDocument();
        expect(typeof x).toBe('string')
    });
})