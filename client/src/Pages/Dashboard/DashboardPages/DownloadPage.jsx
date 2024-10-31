import React, { useState, useRef } from 'react';
import * as Icons from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

const DownloadPage = () => {
  const pageRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrcodes, setQrcodes] = useState([
    { id: 1, name: 'Voice of customers', link: 'https://dowellfileuploader.uxlivinglab.online/qrCodes/qrcode_1730188999658.png', icon: 'Users', customLogo: null },
    { id: 2, name: 'Menu', link: 'https://dowellfileuploader.uxlivinglab.online/qrCodes/qrcode_1730189000039.png', icon: 'Menu', customLogo: null },
    { id: 3, name: 'Website/Social media', link: 'https://dowellfileuploader.uxlivinglab.online/qrCodes/qrcode_1730189000110.png', icon: 'Globe', customLogo: null },
    { id: 4, name: 'Notice', link: 'https://dowellfileuploader.uxlivinglab.online/qrCodes/qrcode_1730189000161.png', icon: 'Bell', customLogo: null },
    { id: 5, name: 'Logo', link: 'https://dowellfileuploader.uxlivinglab.online/qrCodes/qrcode_1730189000224.png', icon: 'Image', customLogo: null },
    { id: 6, name: 'Other Services', link: 'https://dowellfileuploader.uxlivinglab.online/qrCodes/qrcode_1730189000273.png', icon: 'Plus', customLogo: null }
  ]);

  const iconNames = Object.keys(Icons).filter(key => key !== 'default');

  const handleNameChange = (id, newName) => {
    setQrcodes(qrcodes.map(qr => qr.id === id ? { ...qr, name: newName } : qr));
  };

  const handleIconChange = (id, newIcon) => {
    setQrcodes(qrcodes.map(qr => qr.id === id ? { ...qr, icon: newIcon, customLogo: null } : qr));
  };

  const handleLogoUpload = (id, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setQrcodes(qrcodes.map(qr => 
          qr.id === id ? { ...qr, customLogo: e.target.result, icon: null } : qr
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const getCellPosition = (index) => {
    switch(index) {
      case 0: return 'col-start-2 row-start-1';
      case 1: return 'col-start-1 row-start-2';
      case 2: return 'col-start-2 row-start-2';
      case 3: return 'col-start-3 row-start-2';
      case 4: return 'col-start-4 row-start-2';
      case 5: return 'col-start-2 row-start-3';
      default: return '';
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const element = pageRef.current;

      // Create a clone of the element for PDF generation
      const cloneElement = element.cloneNode(true);
      document.body.appendChild(cloneElement);
      cloneElement.style.position = 'absolute';
      cloneElement.style.left = '-9999px';
      cloneElement.style.top = '-9999px';

      // Find all rotated labels in the clone and adjust them for capture
      const rotatedLabels = cloneElement.querySelectorAll('.rotated-text');
      rotatedLabels.forEach(label => {
        const text = label.value;
        const direction = label.dataset.direction;
        const container = label.parentElement;
        
        // Create a non-rotated replacement
        const replacement = document.createElement('div');
        replacement.style.position = 'absolute';
        replacement.style.width = '1.5in';
        replacement.style.textAlign = 'center';
        replacement.style.fontSize = '0.75rem';
        replacement.innerText = text;

        // Position based on original direction
        if (direction === 'left') {
          replacement.style.left = '-1.5in';
          replacement.style.top = '0.75in';
        } else if (direction === 'right') {
          replacement.style.right = '-1.5in';
          replacement.style.top = '0.75in';
        }

        container.appendChild(replacement);
        label.style.display = 'none';
      });

      const canvas = await html2canvas(cloneElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // Clean up the clone
      document.body.removeChild(cloneElement);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [8.5, 11]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);
      pdf.save('qr-codes.pdf');
    } catch (error) {
      toast.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <button 
        onClick={handleDownloadPDF}
        disabled={isDownloading}
        className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isDownloading ? (
          <>
            <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Icons.Download className="mr-2 h-4 w-4" />
            Download PDF
          </>
        )}
      </button>

      <div 
        ref={pageRef}
        className="w-[8.5in] h-[11in] bg-white p-8 mx-auto relative shadow-lg"
      >
        <div className="flex justify-center items-center h-full">
          <div className="grid grid-cols-4 grid-rows-3 gap-4">
            {qrcodes.map((qr, index) => (
              <div 
                key={qr.id} 
                className={`
                  ${getCellPosition(index)}
                  relative
                  w-[2in]
                  h-[2in]
                  border-2
                  border-dashed
                  border-gray-300
                  flex
                  items-center
                  justify-center
                  group
                `}
              >
                {/* Cutting guides */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-black" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-black" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-black" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-black" />
                </div>

                {/* QR Code with centered icon/logo */}
                <div className="relative w-[1.5in] h-[1.5in]">
                  <img 
                    src={qr.link} 
                    alt={`${qr.name} QR Code`} 
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Icon/Logo overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {qr.customLogo ? (
                      <div className="bg-white bg-opacity-80 p-2 rounded-full">
                        <img 
                          src={qr.customLogo} 
                          alt="Custom logo" 
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    ) : qr.icon ? (
                      <div className="bg-white bg-opacity-80 p-2 rounded-full shadow-sm">
                        {React.createElement(Icons[qr.icon], {
                          size: 40,
                          className: 'text-gray-800'
                        })}
                      </div>
                    ) : null}
                  </div>

                  {/* Icon/Logo controls */}
                  <div className="absolute -right-24 top-0 hidden group-hover:flex flex-col gap-2 bg-white p-2 rounded shadow-lg z-10">
                    <select 
                      value={qr.icon || ''} 
                      onChange={(e) => handleIconChange(qr.id, e.target.value)}
                      className="text-xs p-1 border rounded"
                    >
                      <option value="">Select Icon</option>
                      {iconNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(qr.id, e.target.files[0])}
                      className="text-xs w-24"
                    />
                  </div>
                  
                  {/* Labels with original alignment */}
                  <input
                    type="text"
                    value={qr.name}
                    onChange={(e) => handleNameChange(qr.id, e.target.value)}
                    className="absolute -top-4 left-0 right-0 text-center text-xs w-full bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={qr.name}
                    onChange={(e) => handleNameChange(qr.id, e.target.value)}
                    className="absolute -bottom-4 left-0 right-0 text-center text-xs w-full bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={qr.name}
                    onChange={(e) => handleNameChange(qr.id, e.target.value)}
                    className="rotated-text absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90 text-center text-xs w-[1.5in] bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded origin-center"
                    placeholder="Label"
                    data-direction="left"
                  />
                  <input
                    type="text"
                    value={qr.name}
                    onChange={(e) => handleNameChange(qr.id, e.target.value)}
                    className="rotated-text absolute -right-20 top-1/2 -translate-y-1/2 rotate-90 text-center text-xs w-[1.5in] bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded origin-center"
                    placeholder="Label"
                    data-direction="right"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;