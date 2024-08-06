'use client'

import Left from "@/component/left"


export default function Orders(){
    return (
        <div>
            <div className="container-fluid overflow-hidden">
        <div className="row vh-100 overflow-auto">
          <Left />
          <div className="col d-flex flex-column h-sm-100">
            <main className="row overflow-auto">
              <div className="col">
                <div className="p-3 bg-light text-dark">
                  <h1 align="center" className="fs-1">
                    Orders
                  </h1>
                 
                </div>
                
              </div>
            </main>
          </div>
        </div>
      </div>
        </div>
    )
}