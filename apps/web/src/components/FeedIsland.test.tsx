import { fireEvent, render, screen } from "@testing-library/preact";
import { FeedIsland } from "./FeedIsland";
import { feedStore } from "../stores/feed";

describe("FeedIsland", () => {
  beforeEach(() => {
    const [first] = feedStore.get();
    feedStore.set([
      {
        ...first,
        id: "test-post",
        likes: 0,
        likedByViewer: false,
        comments: []
      }
    ]);
  });

  it("toggles likes optimistically", async () => {
    render(<FeedIsland />);
    const likeButton = await screen.findByRole("button", { name: /0 likes/i });

    fireEvent.click(likeButton);
    expect(await screen.findByRole("button", { name: /1 likes/i })).toBeInTheDocument();

    fireEvent.click(await screen.findByRole("button", { name: /1 likes/i }));
    expect(await screen.findByRole("button", { name: /0 likes/i })).toBeInTheDocument();
  });
});
