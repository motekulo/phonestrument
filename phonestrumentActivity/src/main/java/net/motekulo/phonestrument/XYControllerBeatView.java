/*
 * Copyright (C) 2016 Denis Crowdy
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package net.motekulo.phonestrument;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.RectShape;
import android.graphics.drawable.shapes.RoundRectShape;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;

public class XYControllerBeatView extends View {
    private int xDown;
    private int yDown;
    private int highlghtStart;
    private int highlightEnd;

    public interface touchListener {
        void onPositionChange(View view, int mouseX, int mouseY, int value);
        void setRange(View view, int xDown, int yDown, int xUp, int yUp);
    }

    private static final String APP_NAME = "Phonestrument";
    // Motekulo swatch colours:
    private static final int MGREY = 0xff4c494f;
    //private static final int MOFFWHITE = 0xffd7d7db;
    private static final int MLIGHTBLUE = 0xff00d4d9;
    private static final int MTURQ = 0xff039599;
    private static final int MBLUE = 0xff003d4e;
    //private static final int MRED = 0xffc8001a;

    private static final int PADDING = 8;

    private XYControllerBeatView.touchListener mTouchListener;
    private int height;
    private int width;

    private ShapeDrawable gridBoundary;
    private ShapeDrawable YDivLine;
    private ShapeDrawable XDivLine;
    private ShapeDrawable beatIndicator;



    private int Xmax;

    private int Ymax;

    private int[][] toggleState;

    private int currentBeat;

    public XYControllerBeatView(Context context) {
        super(context);

        initView();
    }

    public XYControllerBeatView(Context context, AttributeSet attrs) {
        super(context, attrs);
        initView();
    }

    public XYControllerBeatView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);

        initView();
    }

    private void initView() {

        float outerRadius = 16;
        float[] outerRadii = new float[]{outerRadius, outerRadius, outerRadius, outerRadius, outerRadius, outerRadius,
                outerRadius, outerRadius};

        float[] innerRadii = new float[]{outerRadius, outerRadius, outerRadius, outerRadius, outerRadius, outerRadius,
                outerRadius, outerRadius};

        gridBoundary = new ShapeDrawable((new RoundRectShape(outerRadii, null, innerRadii)));
        gridBoundary.getPaint().setColor(MBLUE);

        XDivLine = new ShapeDrawable((new RectShape()));
        XDivLine.getPaint().setColor(Color.WHITE);
        YDivLine = new ShapeDrawable((new RectShape()));
        YDivLine.getPaint().setColor(Color.WHITE);

        outerRadius = 8;
        float[] beatOuterRadii = new float[]{outerRadius, outerRadius, outerRadius, outerRadius, outerRadius, outerRadius,
                outerRadius, outerRadius};

        beatIndicator = new ShapeDrawable((new RoundRectShape(beatOuterRadii, null, null)));
        beatIndicator.getPaint().setColor(MLIGHTBLUE);

        Xmax = 1000; // so this will set the density and also the max number of bars FIXME

        Ymax = 4;

        toggleState = new int[Ymax][Xmax]; // might need an arrayList here?n(see above FIXME)
        highlghtStart = -1;
        highlightEnd = -1;
        setOnTouchListener(new OnTouchListener() {
            public boolean onTouch(final View v, final MotionEvent event) {
                final int Xpos;
                final int Ypos;
                Xpos = (int) event.getX();
                Ypos = (int) event.getY();
                //Log.i(APP_NAME, "Xpos, Ypos " + Xpos + ", " + Ypos);

                if (event.getAction() == MotionEvent.ACTION_DOWN) {
                   // Log.i(APP_NAME, "Mouse down at col " + Ypos);
                    setTouchdownPoint(Xpos, Ypos);
                }

                if (event.getAction() == android.view.MotionEvent.ACTION_UP) {
                    sendMouseValues(Xpos, Ypos);

                }
                return true;
            }

        });
    }

    public void setXmax(int xmax) {
        Xmax = xmax;

    }

    public void setYmax(int ymax) {
        Ymax = ymax;
    }


    public void setCurrentBeat(int beat) {
        currentBeat = beat;
        invalidate();
    }

    public void setToggleState(int[][] toggleArray) {

        for (int i = 0; i < Ymax; i++) {

            for (int j = 0; j < Xmax; j++) {
                toggleState[i][j] = toggleArray[i][j];  // FIXME just copy the array over...
            }

        }

        invalidate();
    }

    // Color in some of the dots from start to end
    public void colorArrayBackground(int start, int end) {
        highlghtStart = start;
        highlightEnd = end;

    }

    private void setTouchdownPoint(int xPos, int yPos) {
        xDown = convertXToBeatArrayValues(xPos);
        yDown = convertYToBeatArrayValues(yPos);
    }

    private void sendMouseValues(int Xpos, int Ypos) {
        // convert to values useful for Pd
        int Xval;
        int Yval;

        Xval = convertXToBeatArrayValues(Xpos);
        Yval = convertYToBeatArrayValues(Ypos);


        if (toggleState[Yval][Xval] == 0) {
            toggleState[Yval][Xval] = 1;
        } else {
            toggleState[Yval][Xval] = 0;
        }

        if (mTouchListener != null) {
            mTouchListener.onPositionChange(this, Yval, Xval, toggleState[Yval][Xval]);
            mTouchListener.setRange(this, xDown, yDown, Xval, Yval);
        }
        invalidate();
    }

    private int convertXToBeatArrayValues(int x) {
        int Xval;
        float Xproportion;

        Xproportion = (x / (float) width);
        Xval = (int) (Xproportion * Xmax);

        if (Xval < 0) Xval = 0;
        if (Xval >= Xmax) Xval = Xmax - 1;

        return Xval;
    }

    private int convertYToBeatArrayValues(int y) {

        int Yval;

        float Yproportion;

        Yproportion = (height - y) / (float) height;
        Yval = (int) (Yproportion * Ymax);

        if (Yval < 0) Yval = 0;
        if (Yval >= Ymax) Yval = Ymax - 1; // index to be sent

        return Yval;
    }

    public void setTouchListener(final touchListener listener) {
        mTouchListener = listener;
    }


    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {

        width = View.MeasureSpec.getSize(widthMeasureSpec);
        height = View.MeasureSpec.getSize(heightMeasureSpec);

        this.setMeasuredDimension(width, height);

    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        width = w;
        height = h;

    }

    @Override
    protected void onDraw(final Canvas canvas) {

        gridBoundary.setBounds(0, 0, width, height);
        gridBoundary.draw(canvas);

        int pixelsPerXDiv;
        int pixelsPerYDiv;

        pixelsPerXDiv = (width - PADDING) / Xmax;

        pixelsPerYDiv = height / Ymax;

        for (int i = 0; i < Ymax; i++) {
            for (int j = 0; j < Xmax; j++) {

                if (toggleState[i][j] == 0) {
                    if (j >= highlghtStart && j <= highlightEnd) {
                        beatIndicator.getPaint().setColor(MTURQ);
                    } else {
                        beatIndicator.getPaint().setColor(MGREY);
                    }
                    // Draw a coloured rect
                } else {
                    beatIndicator.getPaint().setColor(MLIGHTBLUE);
                    // Draw another coloured rect (black?)
                }


                beatIndicator.setBounds(j * pixelsPerXDiv + PADDING, ((Ymax - (i + 1)) * pixelsPerYDiv) + PADDING,
                        j * pixelsPerXDiv + pixelsPerXDiv, (Ymax - (i + 1)) * pixelsPerYDiv + pixelsPerYDiv);
                beatIndicator.draw(canvas);

            }
        }

        for (int i = 0; i < Ymax; i++) {

            YDivLine.setBounds(0, i * pixelsPerYDiv, width, (i * pixelsPerYDiv) + 4);
            YDivLine.getPaint().setColor(Color.WHITE);
        }

        for (int i = 0; i < Xmax; i++) {
            if (i == currentBeat) {
                XDivLine.getPaint().setColor(Color.RED);
            } else {
                XDivLine.getPaint().setColor(Color.WHITE);
            }
            XDivLine.setBounds(i * pixelsPerXDiv, 0, (i * pixelsPerXDiv) + 4, height);

        }


    }

}