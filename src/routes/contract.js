import express from 'express';
import { ethers } from 'ethers';
import CRTTokenService from '../../contractService.js';

const router = express.Router();
const crtService = new CRTTokenService();

// ============= USER DATA ROUTES =============

// Get user's token balance
router.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    const balance = await crtService.getTokenBalance(address);
    res.json({ address, balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's staking status
router.get('/staking-status/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    const stakingStatus = await crtService.getUserStakingStatus(address);
    res.json({ address, ...stakingStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's activity history
router.get('/activity/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    const activity = await crtService.getUserActivity(address);
    res.json({ address, ...activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate user's pending rewards
router.get('/rewards/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    const rewards = await crtService.calculateRewards(address);
    res.json({ address, pendingRewards: rewards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if user can perform specific actions
router.get('/can-stake/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { type } = req.query; // 'vc' or 'dao'
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    const balance = await crtService.getTokenBalance(address);
    const stakingStatus = await crtService.getUserStakingStatus(address);
    const requirements = await crtService.getStakeRequirements();
    
    let canStake = false;
    let reason = '';
    
    if (type === 'vc') {
      if (stakingStatus.hasVCStake) {
        reason = 'Already staked for VC';
      } else if (parseFloat(balance) < parseFloat(requirements.vcStakeAmount)) {
        reason = `Insufficient balance. Need ${requirements.vcStakeAmount} CRT`;
      } else {
        canStake = true;
      }
    } else if (type === 'dao') {
      if (stakingStatus.hasDAOStake) {
        reason = 'Already staked for DAO';
      } else if (parseFloat(balance) < parseFloat(requirements.daoStakeAmount)) {
        reason = `Insufficient balance. Need ${requirements.daoStakeAmount} CRT`;
      } else {
        canStake = true;
      }
    }
    
    res.json({ address, canStake, reason, requirements });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//============ STAKING ACTION ROUTES =============

// Stake tokens for VC
router.post('/stake/vc', async (req, res) => {
    try {
      const { address } = req.body;
      
      if (!ethers.isAddress(address)) {
        return res.status(400).json({ error: 'Invalid Ethereum address' });
      }
  
      const result = await crtService.stakeForVC(address);
  
      // Convert BigInt values to strings
      const sanitizedResult = JSON.parse(
        JSON.stringify(result, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
      );
  
      res.json({ success: true, ...sanitizedResult });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Stake tokens for DAO
router.post('/stake/dao', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    const result = await crtService.stakeForDAO(address);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unstake tokens from VC
router.post('/unstake/vc', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    const result = await crtService.unstakeFromVC(address);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unstake tokens from DAO
router.post('/unstake/dao', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    const result = await crtService.unstakeFromDAO(address);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/burn/likes', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    const result = await crtService.burnForLike(address);
    const sanitizedResult = JSON.parse(
        JSON.stringify(result, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
      );
      res.json({ success: true, ...sanitizedResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= CONTRACT INFO ROUTES =============

// Get overall contract statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await crtService.getContractStats();
    const requirements = await crtService.getStakeRequirements();
    
    res.json({
      ...stats,
      requirements,
      contractAddress: crtService.contractAddress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stake requirements
router.get('/requirements', async (req, res) => {
  try {
    const requirements = await crtService.getStakeRequirements();
    res.json(requirements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= ADMIN ROUTES =============

// Distribute rewards to multiple users (admin only)
router.post('/admin/distribute-rewards', async (req, res) => {
  try {
    const { userAddresses } = req.body;
    
    if (!Array.isArray(userAddresses)) {
      return res.status(400).json({ error: 'userAddresses must be an array' });
    }
    
    // Validate all addresses
    for (const address of userAddresses) {
      if (!ethers.isAddress(address)) {
        return res.status(400).json({ error: `Invalid address: ${address}` });
      }
    }
    
    const result = await crtService.distributeRewards(userAddresses);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mint new reward tokens (admin only)
router.post('/admin/mint-rewards', async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Valid amount required' });
    }
    
    const result = await crtService.mintRewards(amount);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pause/unpause contract (admin only)
router.post('/admin/pause', async (req, res) => {
  try {
    const result = await crtService.pauseContract();
    res.json({ success: true, message: 'Contract paused', ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/admin/unpause', async (req, res) => {
  try {
    const result = await crtService.unpauseContract();
    res.json({ success: true, message: 'Contract unpaused', ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= EVENT ROUTES =============

// Get event history
router.get('/events/:eventName', async (req, res) => {
  try {
    const { eventName } = req.params;
    const { fromBlock } = req.query;
    
    const events = await crtService.getEventHistory(eventName, fromBlock || 0);
    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;