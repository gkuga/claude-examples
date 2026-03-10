import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterBar from "./FilterBar";

describe("FilterBar", () => {
  it("3つのフィルターボタンが表示されること", () => {
    render(<FilterBar current="all" onChange={vi.fn()} />);
    expect(screen.getByText("すべて")).toBeInTheDocument();
    expect(screen.getByText("未完了")).toBeInTheDocument();
    expect(screen.getByText("完了済み")).toBeInTheDocument();
  });

  it("「すべて」ボタンクリックでonChangeが'all'で呼ばれること", () => {
    const onChange = vi.fn();
    render(<FilterBar current="active" onChange={onChange} />);
    fireEvent.click(screen.getByText("すべて"));
    expect(onChange).toHaveBeenCalledWith("all");
  });

  it("「未完了」ボタンクリックでonChangeが'active'で呼ばれること", () => {
    const onChange = vi.fn();
    render(<FilterBar current="all" onChange={onChange} />);
    fireEvent.click(screen.getByText("未完了"));
    expect(onChange).toHaveBeenCalledWith("active");
  });

  it("「完了済み」ボタンクリックでonChangeが'completed'で呼ばれること", () => {
    const onChange = vi.fn();
    render(<FilterBar current="all" onChange={onChange} />);
    fireEvent.click(screen.getByText("完了済み"));
    expect(onChange).toHaveBeenCalledWith("completed");
  });

  it("現在のフィルターのボタンにactiveクラスがあること", () => {
    render(<FilterBar current="completed" onChange={vi.fn()} />);
    const completedButton = screen.getByText("完了済み");
    expect(completedButton.className).toContain("filter-active");
  });

  it("現在のフィルター以外のボタンにactiveクラスがないこと", () => {
    render(<FilterBar current="completed" onChange={vi.fn()} />);
    const allButton = screen.getByText("すべて");
    const activeButton = screen.getByText("未完了");
    expect(allButton.className).not.toContain("filter-active");
    expect(activeButton.className).not.toContain("filter-active");
  });
});
