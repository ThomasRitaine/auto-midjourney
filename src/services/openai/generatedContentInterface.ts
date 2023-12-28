/**
 * IGeneratedContent defines the structure for NFT-related content generated using GPT.
 *
 * @field nftName: Name of the NFT.
 * @field nftDescription: Brief description of the NFT.
 * @field post: Promotional content for the NFT that is posted on Twitter and Instagram.
 */
interface IGeneratedContent {
  nftName: string;
  nftDescription: string;
  post: string;
}

export default IGeneratedContent;
