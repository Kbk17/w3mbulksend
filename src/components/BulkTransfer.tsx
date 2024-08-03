import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Tooltip,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from '@chakra-ui/react';
import { ethers, BrowserProvider } from 'ethers';
import { FaFileAlt, FaFileUpload, FaSearch, FaChevronDown } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { Editor, useMonaco } from '@monaco-editor/react';
import ERC20ABI from '../ERC20ABI.json';
import BulkTransferABI from '../BulkTransferABI.json';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';

const isEthereumAddress = (address) => /^0x[a-fA-F0-9]{40}$/.test(address);
const isDecimal = (amount) => !isNaN(parseFloat(amount)) && isFinite(amount);

const BulkTransfer = ({ signer, setSigner }) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [recipientsAndAmounts, setRecipientsAndAmounts] = useState('');
  const [message, setMessage] = useState('');
  const [decimals, setDecimals] = useState(18);
  const [contract, setContract] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [errors, setErrors] = useState([]);
  const [tokenOptions, setTokenOptions] = useState([{ symbol: 'ETH', address: 'native', balance: '0' }]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [ethBalance, setEthBalance] = useState('0');
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const contractAddress = "0xea7a481d4f8e19bc787825417571f9397483f38b";
  const toast = useToast();
  const monaco = useMonaco();
  const debounceTimeoutRef = useRef(null);
  const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: 'ethereumData' });

      monaco.languages.setMonarchTokensProvider('ethereumData', {
        tokenizer: {
          root: [
            [/\b0x[a-fA-F0-9]{40}\b/, 'ethereum-address'],
            [/\b\d+(\.\d+)?\b/, 'number'],
            [/,/, 'delimiter'],
          ],
        },
      });
    }
  }, [monaco]);

  const checkWalletConnection = async () => {
    if (walletProvider) {
      try {
        const provider = new BrowserProvider(walletProvider);
        const signer = await provider.getSigner();
        setSigner(signer);

        const contractInstance = new ethers.Contract(contractAddress, BulkTransferABI, signer);
        setContract(contractInstance);

        const balance = await provider.getBalance(signer.address);
        const balanceInEth = ethers.formatEther(balance);
        setEthBalance(balanceInEth);
        setTokenOptions(prevOptions => prevOptions.map(option => option.symbol === 'ETH' ? { ...option, balance: balanceInEth } : option));
      } catch (err) {
        console.error('Failed to check wallet connection', err);
      }
    }
  };

  useEffect(() => {
    checkWalletConnection();
  }, [walletProvider]);

  const fetchTokenDecimals = async (address) => {
    try {
      if (address === '' || address === 'native') {
        setDecimals(18); // Default to 18 for ETH or native tokens
        return;
      }
      const tokenContract = new ethers.Contract(address, ERC20ABI, signer);
      const decimals = await tokenContract.decimals();
      setDecimals(decimals);
    } catch (error) {
      console.error('Failed to fetch token decimals:', error);
      setMessage('Failed to fetch token decimals.');
    }
  };

  const validateInputs = () => {
    const errors = [];
    const lines = recipientsAndAmounts.trim().split('\n');
    lines.forEach((line, index) => {
      const [address, amount] = line.split(',').map((value) => value.trim());
      const lineErrors = [];
      if (!isEthereumAddress(address)) {
        lineErrors.push('correct wallet address');
      }
      if (!isDecimal(amount)) {
        lineErrors.push('correct amount');
      }
      if (lineErrors.length > 0) {
        errors.push({ line: index, message: `Line ${index + 1}: ${lineErrors.join(' and ')}` });
      }
    });
    return errors;
  };

  const debounceValidation = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      const inputErrors = validateInputs();
      setErrors(inputErrors);
    }, 500);
  };

  const approveToken = async () => {
    const inputErrors = validateInputs();
    if (inputErrors.length > 0) {
      setErrors(inputErrors);
      return;
    }

    if (!tokenAddress) {
      setMessage('Please enter the token address.');
      return;
    }
    await fetchTokenDecimals(tokenAddress);
    const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, signer);
    const totalAmount = recipientsAndAmounts
      .trim()
      .split('\n')
      .reduce((acc, line) => {
        const [, amount] = line.split(',').map((value) => value.trim());
        return acc + ethers.parseUnits(amount || '0', decimals);
      }, BigInt(0));

    try {
      const approveTx = await tokenContract.approve(contractAddress, totalAmount);
      await approveTx.wait();
      setIsApproved(true);
      setMessage('Token approved successfully. You can now send the transaction.');
    } catch (error) {
      console.error('Token approval failed:', error);
      setMessage('Token approval failed.');
    }
  };

  const handleSendBulk = async () => {
    const inputErrors = validateInputs();
    if (inputErrors.length > 0) {
      setErrors(inputErrors);
      return;
    }

    if (!contract) {
      setMessage('Contract is not loaded');
      return;
    }

    const lines = recipientsAndAmounts.trim().split('\n');
    const recipients = [];
    const amounts = [];

    lines.forEach((line, index) => {
      const [address, amount] = line.split(',').map((value) => value.trim());
      recipients.push(address);
      try {
        amounts.push(ethers.parseUnits(amount, decimals)); // Convert amounts to BigInt
      } catch (error) {
        console.error(`Error parsing amount at line ${index + 1}: ${amount}`, error);
      }
    });

    const totalAmount = amounts.reduce((acc, amount) => acc + amount, BigInt(0));
    const totalFee = ethers.parseEther('0.01'); // 0.01 ETH fee per batch
    const totalBatches = Math.ceil(recipients.length / 200); // Ensure batch size is set to 200
    const totalValue = tokenAddress === 'native' 
      ? totalFee * BigInt(totalBatches) + totalAmount 
      : totalFee * BigInt(totalBatches); // Total value for ETH

    console.log('Sending transaction with values:', {
      recipients,
      amounts,
      tokenAddress: tokenAddress === 'native' ? ethers.ZeroAddress : tokenAddress,
      totalValue: totalValue.toString(),
      totalAmount: totalAmount.toString(),
      totalFee: totalFee.toString(),
    });

    try {
      const tx = await contract.startBatch(
        recipients,
        amounts,
        tokenAddress === 'native' ? ethers.ZeroAddress : tokenAddress,
        {
          value: totalValue,
          gasLimit: ethers.hexlify(1000000 * totalBatches) // Adjust gas limit for multiple batches
        }
      );
      await tx.wait();
      setMessage('Transaction successful');

      // Start processing batches
      await processBatches();
    } catch (error) {
      console.error('Transaction failed:', error);
      setMessage(`Transaction failed: ${error.message}`);
    }
  };

  const processBatches = async () => {
    if (!contract) return;

    try {
      const tx = await contract.processNextBatch({
        gasLimit: ethers.hexlify(300000), // Adjust gas limit as needed
      });
      await tx.wait();
      setMessage('Batch processed successfully');
    } catch (error) {
      console.error('Batch processing failed:', error);
      setMessage(`Batch processing failed: ${error.message}`);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: '' });

        if (json.length > 500) {
          setMessage('The file contains more than 500 records. Please upload a file with 500 or fewer records.');
          return;
        }
        const formattedData = json
          .map((row) => {
            const address = String(row[0]); // Treat as string
            const amount = String(row[1]); // Treat as string
            return `${address}, ${amount}`;
          })
          .join('\n');
        setRecipientsAndAmounts(formattedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const downloadExampleFile = (format) => {
    const data = [
      ['0x81dead59e3a0423bed9ab5869901e41517458c1e', '20'],
      ['0x508e0be69f49D32335bC37d5Fb84579077da9e4d', '145550'],
      ['0x775E3Dd77ca6c6E4493A28B6d7B65439832688A3', '1000.5'],
      ['0xaB19EE9275bFfD23c75ad467cb98dE4b83747194', '1.5'],
      ['0x992521985D92DCEE6a805EDA5A887fCb8a4885B5', '0.05'],
    ];

    if (format === 'csv') {
      const csvContent = data.map((e) => e.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'example.csv';
      link.click();
    } else if (format === 'txt') {
      const txtContent = data.map((e) => e.join(',')).join('\n');
      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'example.txt';
      link.click();
    } else if (format === 'xlsx') {
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'example.xlsx');
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = { editor, monaco };
    monaco.editor.setTheme('vs-dark');

    editor.onDidBlurEditorWidget(() => {
      debounceValidation();
    });
  };

  const handleEditorChange = (value) => {
    setRecipientsAndAmounts(value || '');
  };

  const handleRemoveInvalidRecords = () => {
    const validRecords = recipientsAndAmounts
      .trim()
      .split('\n')
      .filter((line, index) => !errors.some((e) => e.line === index))
      .join('\n');
    setRecipientsAndAmounts(validRecords);
    setErrors([]);
  };

  const handleHighlightInvalidRecords = () => {};

  const connectWallet = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      setSigner(signer);
      toast({
        title: 'Wallet connected',
        description: `Connected account: ${account}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to connect wallet', error);
      toast({
        title: 'Connection failed',
        description: 'Failed to connect wallet. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className="bulk-transfer-container">
      <Box className="bulk-transfer-inner-container">
        <Heading className="bulk-transfer-heading">
          Bulk Transfer
        </Heading>
        <FormControl className="bulk-transfer-form-control">
          <FormLabel>Select or Enter Token Address</FormLabel>
          <InputGroup>
            <Input
              placeholder="Select or enter token address"
              value={tokenAddress}
              onChange={(e) => {
                setTokenAddress(e.target.value);
                setDropdownOpen(true);
              }}
              onBlur={() => fetchTokenDecimals(tokenAddress)}
              onFocus={() => setDropdownOpen(true)}
            />
            <InputRightElement children={<FaSearch />} />
          </InputGroup>
          {dropdownOpen && (
            <Box
              className="dropdown"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              {tokenOptions.map((token) => (
                <Box
                  key={token.address}
                  className="dropdown-item"
                  onClick={() => {
                    setTokenAddress(token.address);
                    setDropdownOpen(false);
                  }}
                >
                  {token.symbol} ({token.address}) - {token.balance}
                </Box>
              ))}
            </Box>
          )}
        </FormControl>
        <FormControl className="bulk-transfer-form-control">
          <FormLabel>List of Addresses in CSV</FormLabel>
          <HStack justifyContent="space-between" mb={2}>
            <Menu>
              <MenuButton as={Button} rightIcon={<FaChevronDown />}>
                Examples
              </MenuButton>
              <MenuList className="menu-list">
                <MenuItem onClick={() => downloadExampleFile('csv')} className="menu-item">
                  <FaFileAlt /> CSV
                </MenuItem>
                <MenuItem onClick={() => downloadExampleFile('txt')} className="menu-item">
                  <FaFileAlt /> TXT
                </MenuItem>
                <MenuItem onClick={() => downloadExampleFile('xlsx')} className="menu-item">
                  <FaFileAlt /> XLSX
                </MenuItem>
              </MenuList>
            </Menu>
            <Tooltip label="Upload file" fontSize="md">
              <Button as="label" leftIcon={<FaFileUpload />} variant="custom">
                Upload File
                <Input type="file" accept=".xlsx, .csv, .txt" hidden onChange={handleFileUpload} />
              </Button>
            </Tooltip>
          </HStack>
          <Box className="monaco-editor-wrapper">
            <Editor
              height="300px"
              language="ethereumData"
              theme="vs-dark"
              value={recipientsAndAmounts}
              onChange={handleEditorChange}
              options={{
                lineNumbers: 'on',
                minimap: { enabled: false },
                fontSize: 14,
                suggestOnTriggerCharacters: false,
                quickSuggestions: false,
              }}
              editorDidMount={handleEditorDidMount}
              className="monaco-editor"
            />
          </Box>
        </FormControl>
        {signer ? (
          <Button
            className="custom-button"
            variant="custom"
            onClick={isApproved || tokenAddress === 'native' ? handleSendBulk : approveToken}
            isDisabled={!tokenAddress || recipientsAndAmounts.trim().length === 0}
          >
            {isApproved || tokenAddress === 'native' ? 'Send' : 'Approve Token'}
          </Button>
        ) : (
          <Button className="custom-button" variant="custom" onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}
        {message && (
          <Alert status="info" mt={4}>
            <AlertIcon />
            {message}
          </Alert>
        )}
        {errors.length > 0 && (
          <Box mt={4}>
            <Heading as="h4" size="md" mb={2}>Invalid Records:</Heading>
            {errors.map((error) => (
              <Alert status="error" key={error.line} className="error-alert">
                <AlertIcon className="error-alert-icon" />
                {error.message}
              </Alert>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BulkTransfer;
