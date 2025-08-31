import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const CRT_TOKEN_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "burnForLike",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "reason",
				"type": "string"
			}
		],
		"name": "burnTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "EnforcedPause",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "ExpectedPause",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "ReentrancyGuardReentrantCall",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "lockPeriod",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "DAOStaked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "DAOUnstaked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "users",
				"type": "address[]"
			}
		],
		"name": "distributeRewards",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isVC",
				"type": "bool"
			}
		],
		"name": "emergencyUnstake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "emergencyWithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mintRewards",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Paused",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "reason",
				"type": "string"
			}
		],
		"name": "RewardDistributed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "lockPeriodDays",
				"type": "uint256"
			}
		],
		"name": "stakeForDAO",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stakeForVC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "reason",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "TokensBurned",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unpause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Unpaused",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "unstakeFromDAO",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unstakeFromVC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "VCStaked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "VCUnstaked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "calculateRewards",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DAO_STAKE_AMOUNT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "daoStakes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "lockPeriod",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalSupply_",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "contractBalance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalBurned",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getDAOStakeInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakeTimestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "unlockTimestamp",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserActivity",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalStaked",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalUnstaked",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalBurned",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakingCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "unstakingCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "burnCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastActivityTimestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserStakingStatus",
		"outputs": [
			{
				"internalType": "bool",
				"name": "hasVCStake",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "hasDAOStake",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "vcStakeAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "daoStakeAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "daoUnlockTime",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "isDAOStaker",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "isVCStaker",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "LIKE_BURN_AMOUNT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userActivities",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalStaked",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalUnstaked",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalBurned",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakingCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "unstakingCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "burnCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastActivityTimestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "VC_STAKE_AMOUNT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "vcStakes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

class CRTTokenService {
  constructor() {
    this.contractAddress = process.env.CRT_CONTRACT_ADDRESS;
    this.rpcUrl = process.env.SEPOLIA_RPC_URL;
    this.privateKey = process.env.SEPOLIA_PRIVATE_KEY;
    
    if (!this.contractAddress || !this.rpcUrl) {
      throw new Error('Missing required environment variables: CRT_CONTRACT_ADDRESS, SEPOLIA_RPC_URL');
    }
    
    // Read-only provider for view functions
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    this.readOnlyContract = new ethers.Contract(this.contractAddress, CRT_TOKEN_ABI, this.provider);
    
    // Signer for write functions (admin only)
    if (this.privateKey) {
      this.wallet = new ethers.Wallet(this.privateKey, this.provider);
      this.contract = new ethers.Contract(this.contractAddress, CRT_TOKEN_ABI, this.wallet);
    }
  }
  
  // ============= READ FUNCTIONS =============
  
  async getTokenBalance(userAddress) {
    try {
      const balance = await this.readOnlyContract.balanceOf(userAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }
  
  async isVCStaker(userAddress) {
    try {
      return await this.readOnlyContract.isVCStaker(userAddress);
    } catch (error) {
      throw new Error(`Failed to check VC staker status: ${error.message}`);
    }
  }
  
  async isDAOStaker(userAddress) {
    try {
      return await this.readOnlyContract.isDAOStaker(userAddress);
    } catch (error) {
      throw new Error(`Failed to check DAO staker status: ${error.message}`);
    }
  }
  
  async getUserStakingStatus(userAddress) {
    try {
      const [hasVCStake, hasDAOStake, vcStakeAmount, daoStakeAmount, daoUnlockTime] = 
        await this.readOnlyContract.getUserStakingStatus(userAddress);
      
      return {
        hasVCStake,
        hasDAOStake,
        vcStakeAmount: ethers.formatEther(vcStakeAmount),
        daoStakeAmount: ethers.formatEther(daoStakeAmount),
        daoUnlockTime: daoUnlockTime.toString(),
        daoUnlockDate: daoUnlockTime > 0 ? new Date(Number(daoUnlockTime) * 1000) : null,
		requiredAmount: '50'
      };
    } catch (error) {
      throw new Error(`Failed to get staking status: ${error.message}`);
    }
  }
  
  async getUserActivity(userAddress) {
    try {
      const [totalStaked, totalUnstaked, totalBurned, stakingCount, unstakingCount, burnCount, lastActivityTimestamp] = 
        await this.readOnlyContract.getUserActivity(userAddress);
      
      return {
        totalStaked: ethers.formatEther(totalStaked),
        totalUnstaked: ethers.formatEther(totalUnstaked),
        totalBurned: ethers.formatEther(totalBurned),
        stakingCount: stakingCount.toString(),
        unstakingCount: unstakingCount.toString(),
        burnCount: burnCount.toString(),
        lastActivityTimestamp: lastActivityTimestamp.toString(),
        lastActivityDate: lastActivityTimestamp > 0 ? new Date(Number(lastActivityTimestamp) * 1000) : null
      };
    } catch (error) {
      throw new Error(`Failed to get user activity: ${error.message}`);
    }
  }
  
  async calculateRewards(userAddress) {
    try {
      const rewards = await this.readOnlyContract.calculateRewards(userAddress);
      return ethers.formatEther(rewards);
    } catch (error) {
      throw new Error(`Failed to calculate rewards: ${error.message}`);
    }
  }
  
  async getContractStats() {
    try {
      const [totalSupply, contractBalance, totalBurned] = await this.readOnlyContract.getContractStats();
      
      return {
        totalSupply: ethers.formatEther(totalSupply),
        contractBalance: ethers.formatEther(contractBalance),
        totalBurned: ethers.formatEther(totalBurned)
      };
    } catch (error) {
      throw new Error(`Failed to get contract stats: ${error.message}`);
    }
  }
  
  async getStakeRequirements() {
    try {
      const [vcAmount, daoAmount, likeAmount] = await Promise.all([
        this.readOnlyContract.VC_STAKE_AMOUNT(),
        this.readOnlyContract.DAO_STAKE_AMOUNT(),
        this.readOnlyContract.LIKE_BURN_AMOUNT()
      ]);
      
      return {
        vcStakeAmount: ethers.formatEther(vcAmount),
        daoStakeAmount: ethers.formatEther(daoAmount),
        likeBurnAmount: ethers.formatEther(likeAmount)
      };
    } catch (error) {
      throw new Error(`Failed to get stake requirements: ${error.message}`);
    }
  }
  
  // ============= ADMIN WRITE FUNCTIONS =============
  
  async distributeRewards(userAddresses) {
    try {
      if (!this.contract) {
        throw new Error('No wallet configured for write operations');
      }
      
      const tx = await this.contract.distributeRewards(userAddresses);
      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      throw new Error(`Failed to distribute rewards: ${error.message}`);
    }
  }
  
  async mintRewards(amount) {
    try {
      if (!this.contract) {
        throw new Error('No wallet configured for write operations');
      }
      
      const amountWei = ethers.parseEther(amount.toString());
      const tx = await this.contract.mintRewards(amountWei);
      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      throw new Error(`Failed to mint rewards: ${error.message}`);
    }
  }
  
  async pauseContract() {
    try {
      if (!this.contract) {
        throw new Error('No wallet configured for write operations');
      }
      
      const tx = await this.contract.pause();
      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      throw new Error(`Failed to pause contract: ${error.message}`);
    }
  }
  
  async unpauseContract() {
    try {
      if (!this.contract) {
        throw new Error('No wallet configured for write operations');
      }
      
      const tx = await this.contract.unpause();
      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      throw new Error(`Failed to unpause contract: ${error.message}`);
    }
  }

  // ================= USER WRITE FUNCTIONS =================
  async stakeForVC() {
    const tx = await this.contract.stakeForVC();
    return await tx.wait();
  }

  async unstakeFromVC() {
    const tx = await this.contract.unstakeFromVC();
    return await tx.wait();
  }

  async stakeForDAO(lockDays) {
    const tx = await this.contract.stakeForDAO(lockDays);
    return await tx.wait();
  }

  async unstakeFromDAO() {
    const tx = await this.contract.unstakeFromDAO();
    return await tx.wait();
  }

  async burnForLike() {
    const tx = await this.contract.burnForLike();
    return await tx.wait();
  }

  async burnTokens(amount, reason) {
    const amountWei = ethers.parseEther(amount.toString());
    const tx = await this.contract.burnTokens(amountWei, reason);
    return await tx.wait();
  }
  
  // ============= EVENT LISTENING =============
  
  async listenToEvents() {
    // Listen to all contract events
    this.readOnlyContract.on("VCStaked", (user, amount, timestamp) => {
      console.log(`VC Staked: ${user} staked ${ethers.formatEther(amount)} CRT`);
    });
    
    this.readOnlyContract.on("DAOStaked", (user, amount, lockPeriod, timestamp) => {
      console.log(`DAO Staked: ${user} staked ${ethers.formatEther(amount)} CRT for ${lockPeriod} seconds`);
    });
    
    this.readOnlyContract.on("TokensBurned", (user, amount, reason, timestamp) => {
      console.log(`Tokens Burned: ${user} burned ${ethers.formatEther(amount)} CRT for ${reason}`);
    });
    
    this.readOnlyContract.on("RewardDistributed", (user, amount, reason) => {
      console.log(`Reward Distributed: ${user} received ${ethers.formatEther(amount)} CRT for ${reason}`);
    });
  }
  
  async getEventHistory(eventName, fromBlock = 0) {
    try {
      const events = await this.readOnlyContract.queryFilter(eventName, fromBlock);
      return events.map(event => ({
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        args: event.args
      }));
    } catch (error) {
      throw new Error(`Failed to get event history: ${error.message}`);
    }
  }
}

export default CRTTokenService;