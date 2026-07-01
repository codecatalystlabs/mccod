import { Modal, Button } from "antd";
import React from "react";
import { useState } from "react";

function nl2br(str: string) {
   return str.replace(/\n/g, "<br />");
}

interface DorisReportModalProps {
   report: string;
}

export const DorisReportModal: React.FC<DorisReportModalProps> = ({ report }) => {
   const [visible, setVisible] = useState(false);

   const showModal = () => {
      setVisible(true);
   };

   const handleOk = (e) => {
      console.log(e);
      setVisible(false);
   };

   const handleCancel = (e) => {
      console.log(e);
      setVisible(false);
   };

   return (
      <div>
         <Button type="primary" onClick={showModal}>
            View Report
         </Button>
         <Modal title="Doris Report" visible={visible} onOk={handleOk} onCancel={handleCancel}>
            <p dangerouslySetInnerHTML={{ __html: nl2br(report) }}></p>
         </Modal>
      </div>
   );
};
